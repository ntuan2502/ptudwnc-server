const mongoose = require('mongoose');
require('./models/users.model');
const { MONGODB_URL } = require('./config/mainConfig');

mongoose.connect(MONGODB_URL)
  .then(db => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.log(err);
  })