const express = require('express');
// const validate = require('express-validation');
// const expressJwt = require('express-jwt');
// const paramValidation = require('../../config/param-validation');
// const authCtrl = require('./auth.controller');
const AuthController = require('./AuthController');
// const config = require('../../config/config');
const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct email and password is provided */
// router.post('/login')
//   .post(validate(paramValidation.login), AuthController.login);

router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);

router.post('/', AuthController.register)

router.route('/test')
  .get((req, res) => { res.send('working') });


/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
// router.route('/random-number')
//   .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

// function login(req, res, next) {
//   AuthController.login(req)
//     .then(feedback => res.send(feedback))
//     .catch(err => next(err));
// }

// function logout(req, res, next) {
//   AuthController.logout(req)
//     .then(feedback => res.send(feedback))
//     .catch(err => next(err));
// }

module.exports = router; 
