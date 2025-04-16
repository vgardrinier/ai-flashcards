const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eloScoreSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  score: {
    type: Number,
    default: 1000
  },
  level_name: {
    type: String,
    default: 'AI Apprentice'
  },
  history: [{
    date: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      required: true
    },
    change: {
      type: Number,
      required: true
    },
    quiz_session_id: {
      type: Schema.Types.ObjectId,
      ref: 'QuizSession',
      default: null
    }
  }],
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for faster queries
eloScoreSchema.index({ user_id: 1, category_id: 1 }, { unique: true });

const ELOScore = mongoose.model('ELOScore', eloScoreSchema);

module.exports = ELOScore;
