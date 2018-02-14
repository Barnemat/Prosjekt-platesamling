'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

var buildDir = 'dist';
var appDir = 'src';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 next();
});

mongoose.connect('mongodb://localhost:27017/record_collection');

// On Database Connection
mongoose.connection.on('connected', (res) => {
  console.log('Connected to database, succesfully.');
});
// On Database Error
mongoose.connection.on('error', (err) => {
  console.error('Database error:' + err);
});

var api = require('./server/routes/api');

app.use(express.static(path.join(__dirname, buildDir)));
app.use('/api', api);

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, buildDir, 'index.html'));
});

var PORT = 8080;

app.listen(PORT, function() {
  console.log('Express server running at localhost:' + PORT);
});
