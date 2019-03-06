const express = require('express');
const Housing = require('../models/Housing');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    let conditions = serializeQuery(req.query);
    Housing.find(conditions).then(data => res.json(data));
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

function serializeQuery(query) {
  let conditions = {};

  if (query.type) conditions.type = query.type.toLowerCase();
  if (query.postingDate) {
    date = query.postingDate.split('-');
    conditions.posting_date = {};
    conditions.posting_date.$gte = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
    conditions.posting_date.$lt = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]) + 1);
  } else {
    // default to current date
    let date = new Date();
    date.setHours(0,0,0,0);
    conditions.posting_date = {$gte: date};
  }
  if (query.priceFrom || query.priceTo) {
    conditions.price = {};
    if (query.priceFrom) conditions.price.$gte = parseInt(query.priceFrom);
    if (query.priceTo) conditions.price.$lte = parseInt(query.priceTo);
  }
  if (query.bedrooms && !isNaN(query.bedrooms)) conditions.bedrooms = parseInt(query.bedrooms);
  if (query.craigslist || query.kijiji || query.facebook) {
    conditions.source = { $in: [] };
    if (query.craigslist === 'true') conditions.source.$in.push('craigslist');
    if (query.kijiji === 'true') conditions.source.$in.push('kijiji');
    if (query.facebook === 'true') conditions.source.$in.push('facebook');
  }

  return conditions;
}

module.exports = router;
