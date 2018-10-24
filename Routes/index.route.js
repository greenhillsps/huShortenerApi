
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const urlRedirectRoutes = require('../server/url/url.RedirectorRoute');
const paramValidation = require('../config/param-validation');
const validate = require('express-validation');

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.use('/', [validate(paramValidation.queryUrl), urlRedirectRoutes]);

module.exports = router;
