const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flashcardSchema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
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
  source: {
    type: String,
    default: ''
  },
  media: {
    type: {
      type: String,
      enum: ['image', 'code', 'diagram', 'none'],
      default: 'none'
    },
    url: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true
});

// Index for faster queries by category and tags
flashcardSchema.index({ category_id: 1 });
flashcardSchema.index({ tags: 1 });
flashcardSchema.index({ difficulty: 1 });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
