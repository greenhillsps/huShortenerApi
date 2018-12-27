const Joi = require('joi');

module.exports = {
  // POST /api/url/submit
  createUrl: {
    body: {
      actualUrl: Joi.string().required().max(2083).min(2).regex(
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
      ).uri({
        allowRelative : true
      })
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
    params: {
      id: Joi.string().hex().required()
    }
  },

  queryUrl: {
    body: {
      chai: Joi.number().integer().min(1).max(2)
    },
    query: {
      pakora: Joi.number().integer().min(1).max(2)
    },
    params: {
      alu: Joi.number().integer().min(1).max(2)
    }
  }
};
