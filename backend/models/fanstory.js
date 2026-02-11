const mongoose = require('mongoose');

// Define FanStory schema
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
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Optional: Index name for faster queries (if needed)
fanStorySchema.index({ name: 1 });

// Optional: Add a method to sanitize story text before saving
fanStorySchema.pre('save', function (next) {
  // Remove any potential harmful tags, optional
  // You could also use npm package 'sanitize-html' here if needed
  this.story = this.story.replace(/<\/?[^>]+(>|$)/g, ""); 
  next();
});

module.exports = mongoose.model('FanStory', fanStorySchema);
