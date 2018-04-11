'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fileUpload = require('express-fileupload');

const app = express();

const buildDir = 'dist';
const appDir = 'src';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use((req, res, next) => {
 res.setHeader('Access-Control-Allow-Origin', '*'); // Chnange in production
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 next();
});

mongoose.connect('mongodb://localhost:27017/record_collection'); // Change in production, if needed

// On Database Connection
mongoose.connection.on('connected', (res) => {
  console.log('Connected to database, succesfully.');
});
// On Database Error
mongoose.connection.on('error', (err) => {
  console.error('Database error:' + err);
});

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
