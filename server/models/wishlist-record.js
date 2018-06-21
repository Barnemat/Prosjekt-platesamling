const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    minlength: 1,
    maxlength: 865,
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
});

const WishlistRecord = module.exports = mongoose.model('WishlistRecord', schema);
