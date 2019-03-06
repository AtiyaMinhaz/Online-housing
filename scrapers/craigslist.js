const mongoose = require('mongoose');
const Housing = require('../models/Housing');
const axios = require('axios');
const cheerio = require('cheerio');

/*
Scraper is for educational purposes only:
-limited to 1 HTTP request per 2 seconds
-only scrape the newest 120 (unique) posts
*/

mongoose
  .connect('mongodb://localhost/housing-aggregator', { useNewUrlParser: true })
  .then(() => {
    console.log('in progress...');

    getData()
      .then(data => {
        console.log('scraping complete, inserting into mongodb...');
        Housing.insertMany(data)
          .then(() => {
            console.log('mongodb insert success');
            mongoose.disconnect();
          })
          .catch(err => {
            console.log('mongodb insert failed', err);
            mongoose.disconnect();
          });
      })
      .catch(err => {
        console.log('scraping failed', err);
        mongoose.disconnect();
      });
  })
  .catch(err => console.log(err));

function getData() {
  return new Promise((resolve, reject) => {
    SearchPage.get()
      .then(links => {
        console.log('got links...');
        let promises = [];
        for (let i = 0; i < links.length; i++) {
          promises.push(ContentPage.get(links[i], i * 2000));
        }

        Promise.all(promises)
          .then(data => {
            resolve(data.filter(v => typeof v !== 'undefined'));
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
}

const SearchPage = {
  get() {
    return new Promise((resolve, reject) => {
      axios
        .get('https://vancouver.craigslist.org/search/apa?bundleDuplicates=1')
        .then(res => {
          resolve(this.parseLinks(res.data));
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  parseLinks(html) {
    const $ = cheerio.load(html);
    let links = [];
    $('#sortable-results .rows')
      .children()
      .each((i, elem) => {
        links.push(
          $(elem)
            .children('a')
            .attr('href')
        );
      });
    return links;
  }
};

const ContentPage = {
  // set delay to avoid getting ip banned...
  get(link, delay) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        axios
          .get(link)
          .then(res => {
            let data = this.parseDetails(res.data, link);
            if (data !== null) {
              resolve(data);
            } else {
              resolve();
            }
          })
          .catch(err => {
            reject(err);
          });
      }, delay);
    });
  },
  parseDetails(html, link) {
    try {
      $ = cheerio.load(html);
      $ = cheerio.load($('.page-container .body').html());

      let raw_price = $('.postingtitle .price')
        .html()
        .substr(1);
      let raw_bedrooms = $('.mapAndAttrs .shared-line-bubble:first-child b:nth-child(1)')
        .html()
        .charAt(0);
      let raw_bathrooms = $('.mapAndAttrs .shared-line-bubble:first-child b:nth-child(2)')
        .html()
        .charAt(0);
      if (isNaN(raw_price) || isNaN(raw_bedrooms) || isNaN(raw_bathrooms)) throw 'type error';

      let price = parseInt(raw_price);
      let bedrooms = parseInt(raw_bedrooms);
      let bathrooms = parseInt(raw_bathrooms);
      let posting_date = new Date($('#display-date time').attr('datetime'));
      let title = $('#titletextonly').html();
      let lat = $('#map').attr('data-latitude');
      let lon = $('#map').attr('data-longitude');
      let type = 'rental';
      let source = 'craigslist';
      let post_id = `cr${
        link
          .split('/')
          .reverse()[0]
          .split('.')[0]
      }`;

      return { title, type, lat, lon, price, bedrooms, bathrooms, posting_date, source, link, post_id };
    } catch (e) {
      return null;
    }
  }
};
