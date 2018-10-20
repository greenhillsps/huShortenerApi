const Joi = require('joi');

module.exports = {
  // PUT /api/cart/buy/
  cart: {
    body: {
      customExpiryDate: Joi.boolean().required(),
      urlRedirectto: Joi.boolean().required(),
      enableToggle: Joi.boolean().required(),
      blockIps: Joi.boolean().required(),
      customReports: Joi.boolean().required(),
      fourOfour: Joi.boolean().required(),
      customShortUrl: Joi.boolean().required()
    },
    params: {
      id: Joi.string().hex().required()
    }
  },
};
