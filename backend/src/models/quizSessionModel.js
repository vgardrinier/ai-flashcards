const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSessionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date,
    default: null
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  mode: {
    type: String,
    enum: ['timed', 'untimed', 'category', 'random'],
    default: 'untimed'
  },
  questions: [{
    question_id: {
      type: Schema.Types.ObjectId,
      ref: 'QuizQuestion',
      required: true
    },
    user_answer: {
      type: String,
      default: ''
    },
    is_correct: {
      type: Boolean,
      default: false
    },
    time_taken: {
      type: Number, // in seconds
      default: 0
    }
  }],
  score: {
    type: Number,
    default: 0
  },
  total_questions: {
    type: Number,
    default: 0
  },
  correct_answers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for faster queries
quizSessionSchema.index({ user_id: 1, start_time: -1 });
quizSessionSchema.index({ user_id: 1, category_id: 1 });

const QuizSession = mongoose.model('QuizSession', quizSessionSchema);

module.exports = QuizSession;
