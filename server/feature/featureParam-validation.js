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
          url: Joi.string().allow("").regex(
            /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
          )
        }),
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
          url: Joi.string().allow("")
        }),
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
