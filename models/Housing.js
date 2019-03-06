const mongoose = require('mongoose');

const HousingSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true
  },
  lon: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    default: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  posting_date: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  post_id: {
    type: String,
    required: true
  }
});

module.exports = Housing = mongoose.model('housing', HousingSchema);
