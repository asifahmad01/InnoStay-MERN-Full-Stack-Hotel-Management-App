const mongoose = require('mongoose');

const mongoURL = "mongodb+srv://5841asifkhan:Asif%40123@clusterx.zt65j.mongodb.net/Hotel?retryWrites=true&w=majority&appName=ClusterX";

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