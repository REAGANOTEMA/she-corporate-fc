const mongoose = require('mongoose');

const FanStorySchema = new mongoose.Schema({
  name: String,
  story: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FanStory', FanStorySchema);
