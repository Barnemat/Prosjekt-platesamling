const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Record = module.exports = mongoose.model('Record', new Schema({
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
}));
