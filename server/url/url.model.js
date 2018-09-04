const mongoose = require('mongoose');

/**
 * Url Schema
 */
const UrlSchema = new mongoose.Schema({
  actualUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  analytics: [{
    clickDate: String,
    device: String,
    browser: String,
    language: String,
    refferer: String,
    country: String,
    Region: String,
  },]
  ,
  features: {
    'locked': {
      type: Boolean,
      default: true
    },
    'customExpiryDate': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      customExpiryDate: Date,
    },
    'urlRedirectto': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      Url: String,
    },
    'enableToggle': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      enable: {
        type: Boolean,
        default: false
      },
    },
    'blockIps': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      ips: ["192.168.1.1", "192.168.1.2"],
    },
    'customReports': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
    },
    'fourOfour': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      
    },
    'customShortUrl': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      originalUrl: String,
      shortUrl: String,
    }
  }


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
 * @typedef Url
 */
module.exports = mongoose.model('Url', UrlSchema);
