const Joi = require('joi');

module.exports = {
  // PUT /api/cart/buy/
  update: {
    body: {
      customExpiryDate: Joi
        .object({
          customExpiryDate: Joi.date()
        })
        .required(),
      urlRedirectto: Joi
        .object({
          url: Joi.string().uri({
            scheme: [
              'http',
              'https',
              'www',
              'com'
              
            ]
          })
        })
        .required(),
      enableToggle: Joi
        .object({
          enable: Joi.boolean()
        })
        .required(),
      blockIps: Joi
        .object({
          ips: Joi.array()
        })
        .required(),
      customReports: Joi
        .object({
          type: Joi.string()
        })
        .required(),
      fourOfour: Joi
        .object({
          url: Joi.string()
        })
        .required(),
      customShortUrl: Joi
        .object({
          shortUrl: Joi.string()
        })
        .required(),
    },
    params: {
      id: Joi.string().hex().required()
    }
  },
};
