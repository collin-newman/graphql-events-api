const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.TESTING_DB);
const uri = process.env.TESTING_DB || process.env.PRODUCTION_DB;
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
