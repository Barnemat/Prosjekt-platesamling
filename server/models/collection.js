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
    required: true
  },
  artist: String,
  format: String,
  rating: Number,
  wikiHref: String,
  wikiDesc: String,
  wikiImg: String,
  notes: String
});

schema.plugin(filePlugin, {
  name: 'image'
});

const Record = module.exports = mongoose.model('Record', schema);
