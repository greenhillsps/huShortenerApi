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
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  analytics: [{
    clickDate: String,
    device: String,
    browser: String,
    language: String,
    refferer: String,
    countrie: String,
    Regions: String,
  },]
  ,
  features: {
    'locked': {
      type: Boolean,
      default: false
    },
    'customExpiryDate': {
      locked: {
        type: Boolean,
        default: false
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
    'UrlRedirectto': {
      locked: {
        type: Boolean,
        default: false
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
        default: false
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
    'BlockIps': {
      locked: {
        type: Boolean,
        default: false
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
    'CustomReports': {
      locked: {
        type: Boolean,
        default: false
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      any: any,
    },
    '404Management': {
      locked: {
        type: Boolean,
        default: false
      },
      puchaseDate: Date,
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price'
      },
      boughtPrice: Number,
      expiryDate: Date,
      any: any,
    },
    'customShortUrl': {
      locked: {
        type: Boolean,
        default: false
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
