const Joi = require('joi');

module.exports = {
  // POST /api/feedback/submit
  submit: {
    body: {
      user: Joi.string().hex(),
      name: Joi.string().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      message: Joi.string().required()
    }
  },
  // Get price by id /api/feedback/:userId
  GetFeedback: {
    params: {
      id: Joi.string().hex().required()
    }
  },
  // UPDATE api/feedback/:userId
  update: {
    body: {
      message: Joi.string().required()
    },
    params: {
      id: Joi.string().hex().required()
    }
  },

};
