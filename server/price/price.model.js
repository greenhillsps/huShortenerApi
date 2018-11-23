const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

/**
 * Price Schema
 */
const PriceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  activeFor: {
    type: Number,
    required: true
  },
  utilityArray: []

  // 'customExpiryDate': new Schema ({
  //   price: {
  //     type: Number,
  //     required: true,
  //   },
  //   activeFor: {
  //     type: Number,
  //     required: true,
  //   }
  // }),
  // 'urlRedirectto':{
  //   price: {
  //     type: Number,
  //     required: true,
  //   },
  //   activeFor: {
  //     type: Number,
  //     required: true,
  //   }
  // },
  // 'enableToggle': new Schema ({
  //   price: {
  //     type: Number,
  //     required: true,
  //   },
  //   activeFor: {
  //     type: Number,
  //     required: true
  //   }
  // }),
  // 'blockIps': new Schema ({
  //   price: {
  //     type: Number,
  //     required: true
  //   },
  //   activeFor: {
  //     type: Number,
  //     required: true
  //   }
  // }),
  // 'customReports': new Schema ({
  //   price: {
  //     type: Number,
  //     required: true
  //   },
  //   activeFor: {
  //     type: Number,
  //     required: true,
  //   }
  // }),
  // '404Management': new Schema ({
  //   price: {
  //     type: Number,
  //     required: true
  //   },
  //   activeFor: {
  //     type: Number,
  //     required: true
  //   }
  // }),
  // 'customShortUrl': new Schema ({
  //   price: {
  //     type: Number,
  //     required: true
  //   },
  //   activeFor: {
  //     type: Number,
  //     required: true
  //   }
  // })
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
module.exports = mongoose.model("Price", PriceSchema);
