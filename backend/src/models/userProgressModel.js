const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProgressSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flashcard_id: {
    type: Schema.Types.ObjectId,
    ref: 'Flashcard',
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'learning', 'reviewing', 'mastered'],
    default: 'new'
  },
  times_reviewed: {
    type: Number,
    default: 0
  },
  times_correct: {
    type: Number,
    default: 0
  },
  times_incorrect: {
    type: Number,
    default: 0
  },
  last_reviewed: {
    type: Date,
    default: null
  },
  next_review: {
    type: Date,
    default: null
  },
  ease_factor: {
    type: Number,
    default: 2.5
  },
  interval: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for faster queries
userProgressSchema.index({ user_id: 1, flashcard_id: 1 }, { unique: true });
userProgressSchema.index({ user_id: 1, status: 1 });
userProgressSchema.index({ user_id: 1, next_review: 1 });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
