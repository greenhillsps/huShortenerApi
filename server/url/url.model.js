const mongoose = require('mongoose');
const moment = require('moment');

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
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  queryKey: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50 
  },
  createdAt: {
    type: Date,
    required: true,
    default: moment()
  },
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  totalAmountSpent: {
    type: Number,
    default: 0
  },
  analytics: [{
    clickDate: {
      type: Date,
      default: moment()
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
      totalSpent: {
        type: Number,
        default: 0
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
      url: {
        type: String,
        default: null
      },
      totalSpent: {
        type: Number,
        default: 0
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
      totalSpent: {
        type: Number,
        default: 0
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
      ips: [],
      totalSpent: {
        type: Number,
        default: 0
      },
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
      type: {
        type: String,
        default: null
      },
      totalSpent: {
        type: Number,
        default: 0
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
      url: {
        type: String,
        default: null
      },
      totalSpent: {
        type: Number,
        default: 0
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
      totalSpent: {
        type: Number,
        default: 0
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
