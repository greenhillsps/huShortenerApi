const Joi = require('joi');

module.exports = {
  
  // Get price by id /api/paypal/buy/
  GetFeedbad: {
    params: {
      id: Joi.string().hex().required()
    }
  },
};
