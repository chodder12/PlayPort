const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  developer: { type: String, required: true },
  publisher: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: [String], required: true },
  platform: { type: [String], required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // Optional discount field
  rating: { type: Number, min: 0, max: 10 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Reference to Review documents,
  image: { type: String, required: true },
  trailer: { type: String },
  systemRequirements: {
    os: { type: String },
    processor: { type: String },
    memory: { type: String },
    graphics: { type: String },
    storage: { type: String },
  },
  tags: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;