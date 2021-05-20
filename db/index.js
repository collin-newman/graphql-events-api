const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.PRODUCTION_DB || 'mongodb://localhost/testing';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to mongodb');
});

module.exports = db;
