const express = require('express');
const userRoutes = require('../server/user/user.route');
const authRoutes = require('../server/auth/auth.route');
const urlRoutes = require('../server/url/url.route');
const priceRoutes = require('../server/price/price.route');
const cartRoutes = require('../server/cart/cart.route');
const featureRoutes = require('../server/feature/feature.route');
const VerifyToken = require('../config/VerifyToken');
const router = express.Router(); // eslint-disable-line new-cap
var useragent = require('express-useragent');

router.use(useragent.express()); //remove this code, temporary for fikifoo

// TODO: use glob to match *.route files


/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.get('/fikifoo', (req, res) => {



   var iphone = 'https://itunes.apple.com/pk/app/fikifoo-local-food-delivery/id1442856469?mt=8';
   var android = 'https://play.google.com/store/apps/details?id=com.tekgenisys.fikifoo&hl=en';
  //var fikifoo = 'https://fikifoo.com';

  //res.redirect(307, fikifoo);
  var isiPhone = req.useragent.isiPhone;
  if (isiPhone) {
      res.redirect(307, iphone)
  }
  res.redirect(307, android);
})

// mount auth routes on /auth
router.use('/auth', authRoutes);



// mount users routes at /users
router.use('/users', [VerifyToken, userRoutes]);

// mount url routes at /url
router.use('/url', [VerifyToken, urlRoutes]);

// mount price routes at /price
router.use('/price', [VerifyToken, priceRoutes]);


// mount cart routes at /cart
router.use('/cart', [VerifyToken, cartRoutes]);

// mount feature routes at /feature
router.use('/feature', [VerifyToken, featureRoutes]);

router.use('/redirect', (req, res) => {
  res.redirect('https://www.google.com.pk');
})


module.exports = router;
