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
  queryKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  analytics: [{
    clickDate: {
      type: String,
      default: Date.now
    },
    ip: String,
    device: String,
    browser: String,
    language: String,
    refferer: String,
    country: String,
    Region: String,
  }]
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
      puchaseDate: {
        type: Date,
        default: null
      },
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        default: null
      },
      boughtPrice: {
        type: Number,
        default: null
      },
      expiryDate: {
        type: Date,
        default: null
      },
      customExpiryDate: {
        type: Date,
        default: null
      },
    },
    'urlRedirectto': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: {
        type: Date,
        default: null
      },
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        default: null
      },
      boughtPrice: {
        type: Number,
        default: null
      },
      expiryDate: {
        type: Date,
        default: null
      },
      Url: {
        type: String,
        default: null
      },
    },
    'enableToggle': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: {
        type: Date,
        default: null
      },
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        default: null
      },
      boughtPrice: {
        type: Number,
        default: null
      },
      expiryDate: {
        type: Date,
        default: null
      },
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
      puchaseDate: {
        type: Date,
        default: null
      },
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        default: null
      },
      boughtPrice: {
        type: Number,
        default: null
      },
      expiryDate: {
        type: Date,
        default: null
      },
      ips: ["192.168.1.1", "192.168.1.2"],
    },
    'customReports': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: {
        type: Date,
        default: null
      },
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        default: null
      },
      boughtPrice: {
        type: Number,
        default: null
      },
      expiryDate: {
        type: Date,
        default: null
      },
    },
    'fourOfour': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: {
        type: Date,
        default: null
      },
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        default: null
      },
      boughtPrice: {
        type: Number,
        default: null
      },
      expiryDate: {
        type: Date,
        default: null
      },

    },
    'customShortUrl': {
      locked: {
        type: Boolean,
        default: true
      },
      puchaseDate: {
        type: Date,
        default: null
      },
      currentPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Price',
        default: null
      },
      boughtPrice: {
        type: Number,
        default: null
      },
      expiryDate: {
        type: Date,
        default: null
      },
      originalUrl: {
        type: String,
        default: null
      },
      shortUrl: {
        type: String,
        default: null
      },
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
