const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  uniqueKey: {
    type: String,
    required: true
  },
  signUpIp: {
    type: String
  },
  ISOCountryCode: {
    type: String
  },
  ISOCountryName: {
    type: String
  },
  paid: {
    type: Boolean,
    default: false
  },
  salespanel: {
    type: Number,
    default: 0
  },
  wallet: {
    type: Number,
    default: 0
  },
  totalAmountSpent: {
    type: Number,
    default: 0
  },
  totalURLS: {
    type: Number,
    default: 0
  },
  transactionHistory: [{}],
  createdAt: {
    type: Date,
    default: Date.now
  },
  paymentId: []

});



// email: {
//   type: String,
//   required: true,
//   match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'The value of path {PATH} ({VALUE}) is not a valid email address.'],
//   unique: true
// },
// mobileNumber: {
//   type: String,
//   required: true,
//   match: [/([(+]*[0-9]+[()+. -]*)/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
// },

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', UserSchema);
