const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.DB_URL;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connection to mongoDB Server');
})

db.on('error', (err) => {
  console.log('Connection to mongoDB Server');
})

db.on('disconnected', () => {
  console.log('MongoDB disconneceted');
})

module.exports = db;