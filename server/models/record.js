const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const filePluginLib = require('mongoose-file');
const filePlugin = filePluginLib.filePlugin;

const schema = new Schema({
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 865,
  },
  artist: {
    type: String,
    maxlength: 50,
  },
  format: {
    type: String,
    maxlength: 20,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  wikiHref: {
    type: String,
    maxlength: 300,
  },
  wikiDesc: {
    type: String,
    maxlength: 1000,
  },
  wikiImg: {
    type: String,
    maxlength: 300,
  },
  notes: {
    type: String,
    maxlength: 2000,
  }
});

schema.plugin(filePlugin, {
  name: 'image'
});

const Record = module.exports = mongoose.model('Record', schema);
