const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const request = require("request");
// const shortid = require('shortid');
// const APIError = require('../helpers/APIError');

// var VerifyToken = require('../../config/VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require("../user/user.model");

/**
 * Configure JWT
 */
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const bcrypt = require("bcryptjs");
const config = require("../../config/config"); // get config file

function login(req, res, next) {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res
        .status(500)
        .json({
          Status: "500",
          message: "Oops! Something went wrong on our end"
        })
        .send();
    } else if (!user) {
      res.status(404).send({
        auth: false,
        token: null,
        message: "Sorry! User not found"
      });
    } else {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        res
          .status(403)
          .json({
            Status: "403",
            auth: false,
            message: "Username or password is incorrect",
            result: false,
            token: null
          })
          .send();
      } else {
        // if user is found and password is valid
        // create a token
        var token = jwt.sign(
          { id: user._id },
          config.jwtSecret
          // { expiresIn: 86400 // expires in 24 hours}
        );
        user.email = req.body.email;
        // return the information including token as JSON
        res.status(200).send({
          auth: true,
          token: token,
          message: false,
          user: user
        });
      }
    }
  });
  return next;
}

function logout(req, res, next) {
  res.status(200).send({ auth: false, token: null });
  return next;
}

 async function register(req, res, next){
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    email: req.body.email,
    phoneNumber: req.body.mobileNum,
    ISOCountryCode: req.body.countryCode,
    ISOCountryName: req.body.countryName
  });
  await user
    .save()
    .then(User => {
      token = jwt.sign({ id: User._id }, config.jwtSecret);
      res.status(200).send({
        auth: true,
        token: token,
        user: User,
        message: true
      });
    })
    .catch(e => res.status(401).json({message:"Email already exist"}));
};



module.exports = { login, register, logout };
