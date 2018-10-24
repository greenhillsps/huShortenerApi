const Joi = require('joi');

module.exports = {
  
  // Get price by id /api/paypal/buy/
  paypalPay: {
    query: {
      a: Joi.number().required()
    }
  },
};
