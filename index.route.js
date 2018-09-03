const express = require('express');
const userRoutes = require('./server/user/user.route');
const authRoutes = require('./server/auth/auth.route');
const urlRoutes = require('./server/url/url.route');
const priceRoutes = require('./server/price/price.route');
const feedbackRoutes = require('./server/feedback/feedback.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount url routes at /url
router.use('/url', urlRoutes);

// mount price routes at /price
router.use('/price', priceRoutes);

// mount feedback routes at /feedback
router.use('/feedback', feedbackRoutes);

module.exports = router;
