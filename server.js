const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const housing = require('./routes/housing');

const app = express();
app.use(bodyParser.json());

mongoose
  .connect('mongodb://localhost/housing-aggregator', { useNewUrlParser: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

app.use('/housing', housing);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on port ${port}`));
