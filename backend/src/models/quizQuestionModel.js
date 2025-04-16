const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizQuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    is_correct: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  tags: [{
    type: String,
    trim: true
  }],
  related_flashcard_id: {
    type: Schema.Types.ObjectId,
    ref: 'Flashcard',
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
quizQuestionSchema.index({ category_id: 1 });
quizQuestionSchema.index({ difficulty: 1 });
quizQuestionSchema.index({ tags: 1 });

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

module.exports = QuizQuestion;
