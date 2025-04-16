const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eloLevelSchema = new Schema({
  min_score: {
    type: Number,
    required: true
  },
  max_score: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  badge_icon: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
eloLevelSchema.index({ min_score: 1, max_score: 1 });

const ELOLevel = mongoose.model('ELOLevel', eloLevelSchema);

module.exports = ELOLevel;
