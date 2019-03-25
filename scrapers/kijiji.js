const mongoose = require('mongoose');
const Housing = require('../models/Housing');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config({ path: '../.env' });

/*
Scraper is for educational purposes only:
-limited to 1 HTTP request per 2 seconds
-only scrape the newest 25 posts
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
  url: 'https://www.kijiji.ca/b-for-rent/vancouver/c30349001l1700287?ad=offering',
  get() {
    return new Promise((resolve, reject) => {
      axios
        .get(this.url)
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
    $('#mainPageContent .container-results')
      .children()
      .each((i, elem) => {
        if ($(elem).attr('data-ad-id')) {
          let path = $(elem)
            .find('.title a')
            .attr('href');
          links.push('https://www.kijiji.ca' + path);
        }
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
            let data = {};
            try {
              data = this.parseDetails(res.data, link);
            } catch (e) {
              console.log(`skipping ${link} :: ${e.message}`);
              return resolve();
            }
            this.convertAddressToLatLon(data.address)
              .then(coords => {
                if (coords.lat && coords.lon) {
                  data.lat = coords.lat;
                  data.lon = coords.lon;
                  resolve(data);
                } else {
                  console.log(`skipping ${link} :: undefined lat-lon`);
                  resolve();
                }
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            reject(err);
          });
      }, delay);
    });
  },
  parseDetails(html, link) {
    let $ = cheerio.load(html);

    let raw_title = $('.title-2323565163').html();
    let raw_posting_date = $('.datePosted-319944123 time').attr('datetime');
    let raw_address = $('.address-3617944557').html();
    let raw_price = $('.currentPrice-441857624 span').attr('content');
    let raw_bedrooms = $('.itemAttributeWrapper-37588635:nth-child(1) .attributeValue-2574930263')
      .html()
      .charAt(0);
    let raw_bathrooms = $('.itemAttributeWrapper-37588635:nth-child(2) .attributeValue-2574930263')
      .html()
      .charAt(0);

    if (!raw_title || !raw_posting_date || !raw_address || !raw_price || !raw_bedrooms || !raw_bathrooms) {
      throw 'missing required field';
    } else if (isNaN(raw_price) || isNaN(raw_bedrooms) || isNaN(raw_bathrooms)) {
      throw 'type error';
    }

    return {
      title: raw_title,
      type: 'rental',
      address: raw_address,
      price: parseInt(raw_price),
      bedrooms: parseInt(raw_bedrooms),
      bathrooms: parseInt(raw_bathrooms),
      posting_date: new Date(raw_posting_date),
      source: 'kijiji',
      link,
      post_id: `ki${link.split('/').reverse()[0]}`
    };
  },
  // https://locationiq.com/docs#forward-geocoding
  convertAddressToLatLon(address) {
    return new Promise((resolve, reject) => {
      axios
        .get(`https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATIONIQ_TOKEN}&q=${address}&format=json`)
        .then(res => {
          let lat = res.data[0].lat;
          let lon = res.data[0].lon;
          resolve({ lat, lon });
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
