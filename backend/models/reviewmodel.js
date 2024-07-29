const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  rating: { type: Number, min: 0, max: 10, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;