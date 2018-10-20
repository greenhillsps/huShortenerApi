const Joi = require('joi');

module.exports = {
  // POST /api/price/submit
  createPrice: {
    body: {
      name: Joi.string().max(50).required(),
      price: Joi.number().required(),
      activeFor: Joi.number().max(50).required(),
      utilityArray: Joi.array()
    }
  },
  // Get price by id /api/price/:userId
  GetPrice: {
    params: {
      id: Joi.string().hex().required()
    }
  },
  // UPDATE /api/price/:userId
  updatePrice: {
    params: {
      id: Joi.string().hex().required()
    }
  },
};
