
var express = require('express');
var path = require('path');

var app = express();

var buildDir = 'dist';
var appDir = 'src';

app.use(express.static(path.join(__dirname, buildDir)));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, buildDir, 'index.html'));
});

var PORT = 8080;

app.listen(PORT, function() {
  console.log('Express server running at localhost:' + PORT);
});
