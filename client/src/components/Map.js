import React, { Component } from 'react';
import axios from 'axios';

class Map extends Component {
  constructor() {
    super();
    window.initMap = this.initMap.bind(this);
  }

  componentDidMount() {
    this.insertHTML();
    this.fetchHousing(null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter.id === 0) return;
    if (prevProps.filter.id !== this.props.filter.id) {
      this.fetchHousing(this.props.filter);
    } else {
      this.clearMap();
      this.populateMap();
    }
  }

  fetchHousing(data) {
    let params = '';
    if (data !== null) {
      params =
        `location=${data.location}&type=${data.type}&postingDate=${data.postingDate}&priceFrom=${data.priceFrom}&priceTo=${data.priceTo}` +
        `&bedrooms=${data.bedrooms}&craigslist=${data.craigslist}&kijiji=${data.kijiji}&facebook=${data.facebook}`;
    }
    axios
      .get('/housing?' + params)
      .then(res => {
        console.log(res.data);
        this.props.updateHousing(res.data);
      })
      .catch(err => {
        console.log('Error::fetchHousing()::', err);
      });
  }

  insertHTML() {
    // https://stackoverflow.com/a/47032648
    // https://developers.google.com/maps/documentation/javascript/tutorial
    let index = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_APIKEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    index.parentNode.insertBefore(script, index);
  }

  initMap() {
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 49.2501, lng: -123.0824 },
      zoom: 12
    });

    this.populateMap();
  }

  populateMap() {
    this.markers = [];
    let infowindow = new window.google.maps.InfoWindow();
    this.props.housing.forEach(property => {
      let marker = new window.google.maps.Marker({
        position: { lat: parseFloat(property.lat), lng: parseFloat(property.lon) },
        map: this.map,
        title: property.title
      });

      marker.addListener('click', function() {
        infowindow.setContent(
          `<b>${property.title}</b><p>$${property.price} - ${property.bedrooms}BR/${property.bathrooms}BR</p><a target="_blank" href="${
            property.link
          }">Source</a>`
        );
        infowindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });
  }

  clearMap() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  render() {
    return <div id="map" />;
  }
}

export default Map;
