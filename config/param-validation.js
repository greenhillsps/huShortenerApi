const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      //username: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      mobileNumber: Joi.string().regex(/([(+]*[0-9]+[()+. -]*)/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      mobileNumber: Joi.string().regex(/([(+]*[0-9]+[()+. -]*)/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      //username: Joi.string().required(),
      email: Joi.string().email({ minDomainAtoms: 2 }).required(),
      password: Joi.string().required()
    }
  }
};
