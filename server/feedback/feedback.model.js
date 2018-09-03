const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Feedback Schema
 */
const FeedbackSchema = new mongoose.Schema({

  Users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

/**
 * Statics
 */


/**
 * @typedef Feedback
 */
module.exports = mongoose.model('Feedback', FeedbackSchema);
