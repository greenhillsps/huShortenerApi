const express = require('express');
const userRoutes = require('../server/user/user.route');
const authRoutes = require('../server/auth/auth.route');
const urlRoutes = require('../server/url/url.route');
const priceRoutes = require('../server/price/price.route');
const feedbackRoutes = require('../server/feedback/feedback.route');
const VerifyToken = require('../config/VerifyToken');


const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);
// mount all routes on /auth
router.use('/auth', authRoutes);

// mount user routes at /users
router.use('/users', [VerifyToken, userRoutes]);

// mount url routes at /url
router.use('/url', [VerifyToken, urlRoutes]);

// mount price routes at /price
router.use('/price', [VerifyToken, priceRoutes]);

// mount feedback routes at /feedback
router.use('/feedback', feedbackRoutes);



module.exports = router;
