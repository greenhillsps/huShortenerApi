var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const APIError = require('../helpers/APIError');

var VerifyToken = require('../../config/VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('../user/user.model');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
const config = require('../../config/config'); // get config file

function login(req, res, next) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id }, config.jwtSecret,
      // { expiresIn: 86400 // expires in 24 hours}
    );

    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token, user: user });
  });
  return next
};

function logout(req, res) {
  res.status(200).send({ auth: false, token: null });
};
/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName 
 * @property {string} req.body.lastName 
 * @property {string} req.body.password
 * @property {string} req.body.email
 * @property {string} req.body.mobileNumber 
 * @returns {User}
 */
async function register(req, res, next) {

  if (await User.findOne({ email: req.body.email })) {

    res.status(403)
      .json({
        Status: '403',
        message: ' email ' + req.body.email + ' is already taken'
      })
      .send()
  } else {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    });

    var token;
    // { expiresIn: 86400 // expires in 24 hours}


    await user.save()
      .then(User => {
        token = jwt.sign({ id: User._id }, config.jwtSecret,
          // { expiresIn: 86400 // expires in 24 hours}
          console.log(User)

        );
        res.status(200).send({ auth: true, token: token, user: User })
      })
      // .then(User => res.status(200).send({ auth: true, token: token, user: User }))
      .catch(e => next(e));
  }
}


// router.get('/me', VerifyToken, function (req, res, next) {

//   User.findById(req.userId, { password: 0 }, function (err, user) {
//     if (err) return res.status(500).send("There was a problem finding the user.");
//     if (!user) return res.status(404).send("No user found.");
//     res.status(200).send(user);
//   });

// });

module.exports = { login, register, logout };