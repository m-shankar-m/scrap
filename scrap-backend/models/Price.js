const mongoose = require('mongoose');

const PriceSchema = mongoose.Schema({
  material: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Price', PriceSchema);