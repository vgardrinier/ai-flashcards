const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date,
    default: Date.now
  },
  preferences: {
    dark_mode: {
      type: Boolean,
      default: false
    },
    daily_goal: {
      type: Number,
      default: 20
    },
    notification_settings: {
      type: Object,
      default: {
        email: true,
        push: true
      }
    }
  }
}, {
  timestamps: true
});

// Add password hashing middleware here if needed

const User = mongoose.model('User', userSchema);

module.exports = User;
