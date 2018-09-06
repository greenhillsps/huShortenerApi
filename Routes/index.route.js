
const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const urlRedirectRoutes = require('../server/url/url.RedirectorRoute')

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.use('/', urlRedirectRoutes);

module.exports = router;
