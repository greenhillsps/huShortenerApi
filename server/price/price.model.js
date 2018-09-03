const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Price Schema
 */
const PriceSchema = new mongoose.Schema({
  customExpiryDate: new Schema ({
    price: {
      type: Number,
      required: true,
    },
    activeFor: {
      type: Date,
      required: true,
    }
  }),
  UrlRedirectto: new Schema ({
    price: {
      type: Number,
      required: true,
    },
    activeFor: {
      type: Date,
      required: true,
    }
  }),
  enableToggle: new Schema ({
    price: {
      type: Number,
      required: true,
    },
    activeFor: {
      type: Date,
      required: true
    }
  }),
  BlockIps: new Schema ({
    price: {
      type: Number,
      required: true
    },
    activeFor: {
      type: Date,
      required: true
    }
  }),
  CustomReports: new Schema ({
    price: {
      type: Number,
      required: true
    },
    activeFor: {
      type: Date,
      required: true,
    }
  }),
  '404Management': new Schema ({
    price: {
      type: Number,
      required: true
    },
    activeFor: {
      type: Date,
      required: true
    }
  }),
  customShortUrl: new Schema ({
    price: {
      type: Number,
      required: true
    },
    activeFor: {
      type: Date,
      required: true
    }
  })



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
 * @typedef Price
 */
module.exports = mongoose.model('Price', PriceSchema);
