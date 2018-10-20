const Joi = require('joi');

module.exports = {
  // POST /api/url/submit
  createUrl: {
    body: {
      actualUrl: Joi.string().required().max(500)
    }
  },
  // Get Url by id /api/url/:id
  GetUrl: {
    params: {
      id: Joi.string().hex().required()
    }
  },
  // Get Url by token /api/url/:id
  GetUrlByToken: {
    query: {
      page: Joi.number().default(1),
      limit: Joi.number()
    }
  },
  // UPDATE /api/url/:id
  updateUrl: {
    body: {
      _id: Joi.string().hex().required(),
      actualUrl: Joi.string().required(),
      shortUrl: Joi.string().required(),
      queryKey: Joi.string().required(),
      features: Joi.object(),
      urlRedirectto: Joi.object(),
      enableToggle: Joi.object(),
      blockIps: Joi.object(),
      customReports: Joi.object(),
      fourOfour: Joi.object(),
      customShortUrl: Joi.object(),
      analytics: Joi.array(),
      totalAmountSpent: Joi.number(),
      user: Joi.string().hex().required(),
      createdAt: Joi.date(),
      show : Joi.boolean()
    },
    params: {
      id: Joi.string().hex().required()
    }
  },
};
