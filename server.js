'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

const buildDir = 'dist';
const appDir = 'src';

const mongoDBConnection = 'mongodb://localhost:27017/record_collection'; // Change in production, if needed

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*'); // Change in production
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 next();
});

mongoose.connect(mongoDBConnection);

mongoose.connection.on('connected', (res) => {
  console.log('Mongoose connected to MongoDB, succesfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose encountered an error connecting to MongoDB');
});

const mongoStore = new MongoDBStore({
  uri: mongoDBConnection,
  databaseName: 'record_collection',
  collection: 'sessions',
});

mongoStore.on('connected', (res) => {
  console.log('MongoDBStore connected to MongoDB, succesfully.');
});

mongoStore.on('error', (err) => {
  console.error('MongoDBStore encountered an error connecting to MongoDB');

});

app.use(session({
  secret: 'dev-secret',
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 336, // Two weeks
    httpOnly: true,
  },
}));

const api = require('./server/routes/api');

app.use(express.static(path.join(__dirname, buildDir)));
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, buildDir, 'index.html'));
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log('Express server running at localhost:' + PORT);
});
