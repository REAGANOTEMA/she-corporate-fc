const mongoose = require('mongoose');

const fanStorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name can be at most 50 characters']
    },
    story: {
      type: String,
      required: [true, 'Story is required'],
      trim: true,
      minlength: [10, 'Story must be at least 10 characters'],
      maxlength: [1000, 'Story can be at most 1000 characters']
    }
  },
  {
    timestamps: true // automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('FanStory', fanStorySchema);
