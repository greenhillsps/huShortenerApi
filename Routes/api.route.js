const express = require('express');
const userRoutes = require('../server/user/user.route');
const adminUserRoutes = require('../server/adminUser/adminUser.route');
const adminOpRoutes = require('../server/adminOp/adminOp.route');
const authRoutes = require('../server/auth/auth.route');
const urlRoutes = require('../server/url/url.route');
const priceRoutes = require('../server/price/price.route');
const feedbackRoutes = require('../server/feedback/feedback.route');
const cartRoutes = require('../server/cart/cart.route');
const featureRoutes = require('../server/feature/feature.route');
const paypalRoutes = require('../server/Paypal/expressCheckout');
const PPPexec = require('../server/PPexec/PPPexec');
const VerifyToken = require('../config/VerifyToken');
const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);
// mount auth routes on /auth
router.use('/auth', authRoutes);

// mount paypal routes on /paypal
router.use('/paypal', [VerifyToken, paypalRoutes]);

// mount paypal payment execution routes on /PPexec
router.use('/PPexec', PPPexec);

// mount users routes at /users
router.use('/users', [VerifyToken, userRoutes]);

// mount url routes at /url
router.use('/url', [VerifyToken, urlRoutes]);

// mount price routes at /price
router.use('/price', [VerifyToken, priceRoutes]);

// mount feedback routes at /feedback
router.use('/feedback',feedbackRoutes);

// mount cart routes at /cart
router.use('/cart', [VerifyToken, cartRoutes]);

// mount feature routes at /feature
router.use('/feature', [VerifyToken, featureRoutes]);

router.use('/redirect', (req, res) => {
  res.redirect('https://www.google.com.pk');
})

router.use('/adminpanel', adminUserRoutes);

router.use('/adminOp', [VerifyToken, adminOpRoutes]);
module.exports = router;
