const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
// const shortid = require('shortid');
// const APIError = require('../helpers/APIError');

// var VerifyToken = require('../../config/VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('../user/user.model');

/**
 * Configure JWT
 */
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs');
const config = require('../../config/config'); // get config file


function login(req, res, next) {
  let checkBody = {
    "Email": req.body.email,
    "AccessToken": config.cdmToken
  }
  request.post(`${config.cdmUrl}customer/IsEmailAddressTaken`, { form: checkBody },
    async function (err, IsEmailAddressTakenResponse, IsEmailAddressTakenBody) {
      let IsEmailTakenObject = JSON.parse(IsEmailAddressTakenBody);
      if (err) {
        res.status(500)
          .json({
            Status: '500',
            message: IsEmailTakenObject.Message
          })
          .send();
      } else if (IsEmailAddressTakenResponse.statusCode == 200 && IsEmailTakenObject.Result == false) {
        // check if the password is valid
        User.findOne({ uniqueKey: IsEmailTakenObject.Data.UniqueKey.toLowerCase() }, {
          // firstName: 1, lastName: 1, totalURLS: 1, totalAmountSpent: 1, wallet: 1
        }, function (err, user) {

          if (err) {
            res.status(500)
              .json({
                Status: '500',
                message: "Oops! Something went wrong on our end"
              })
              .send();
          }
          else if (!user) {
            res.status(404).send(
              {
                auth: false,
                token: null,
                message: "Sorry! User not found"
              });
          } else {
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
              res.status(403)
                .json({
                  Status: '403',
                  auth: false,
                  message: "Username or password is incorrect",
                  result: IsEmailTakenObject.Result,
                  token: null
                })
                .send()
            } else {

              // if user is found and password is valid
              // create a token
              var token = jwt.sign({ id: user._id }, config.jwtSecret,
                // { expiresIn: 86400 // expires in 24 hours}
              );
              user.email = req.body.email;
              // return the information including token as JSON
              res.status(200).send({
                auth: true,
                token: token,
                message: IsEmailTakenObject.Message,
                user: user
              });
            }
          }
        });
      } else {
        res.status(403)
          .json({
            Status: '403',
            auth: false,
            message: "Username or password is incorrect",
            result: IsEmailTakenObject.Result,
            token: null
          })
          .send()
      }
    })
  return next
};




function logout(req, res, next) {
  res.status(200).send({ auth: false, token: null });
  return next
};
/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName 
 * @property {string} req.body.lastName 
 * @property {string} req.body.password
 * @property {string} req.body.email
 * @property {string} req.body.mobileNumber 
 * @property {string} req.body.countryCode 
 * @returns {User}
 */




async function register(req, res, next) {
  let checkBody = {
    "Email": req.body.email,
    "AccessToken": config.cdmToken
  }
  let insertBody = {
    "FirstName": req.body.firstName,
    "LastName": req.body.lastName,
    "Email": req.body.email,
    "CountryCode": req.body.countryCode,
    "PhoneNumber": req.body.mobileNumber,
    "AccessToken": config.cdmToken
  }

  await request.post(`${config.cdmUrl}customer/IsEmailAddressTaken`, { form: checkBody },
    async function (err, IsEmailAddressTakenResponse, IsEmailAddressTakenBody) {

      let IsEmailTakenObject = JSON.parse(IsEmailAddressTakenBody);
      if (err) {
        res.status(500)
          .json({
            Status: '500',
            message: IsEmailTakenObject.Message
          })
          .send()
      } else if (IsEmailAddressTakenResponse.statusCode == 200 && IsEmailTakenObject.Result == true) {
        await request.post(`${config.cdmUrl}customer/insertcustomer`, { form: insertBody },
          async function (error, insertResponse, insertResponseBody) {

            let insertObject = JSON.parse(insertResponseBody)
            if (error) {
              res.status(500)
                .json({
                  Status: '500',
                  message: insertObject.Message,
                })
                .send()
            } else if (insertResponse.statusCode == 200) {
              let output
              await User.findOne().sort('-_id')
                .then(user => {
                  // console.log(user)
                  if (user) {
                    let Identityres = user.identity.split('-')
                    output = ('DLC-' + (Number(Identityres[1]) + Number(Math.floor(Math.random() * (9 - 1 + 1)) + 1)))
                    console.log(Identityres)
                  }
                  else {

                    output = ('DLC-' + Math.floor(Math.random() * (9 - 1 + 1)) + 1)
                    // console.log(output)
                  }
                })
                .catch(err => {
                  res.status(500)
                    .json({
                      Status: '500',
                      message: insertObject.Message,
                    })
                    .send()
                  console.log(err)
                })
              function newkey() {
                output = Math.random().toString(36).substr(2, 4)
                return
              }

              await User.findOne({ identity: output }).sort('-_id')
                .then(key => {
                  if (key) {
                    newkey()
                  }
                })
                .catch(err => {
                  res.status(500)
                    .json({
                      Status: '500',
                      message: insertObject.Message,
                    })
                    .send()
                  console.log(err)
                })

              let hashedPassword = bcrypt.hashSync(req.body.password, 8);
              // let id = shortid.generate();
              const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password: hashedPassword,
                identity: output,
                uniqueKey: await insertObject.Data.UniqueKey,
                signUpIp: req.clientIp,
                ISOCountryCode: req.body.countryCode,
                ISOCountryName: req.body.countryName
              });

              var token;
              // { expiresIn: 86400 // expires in 24 hours}


              await user.save()
                .then(User => {
                  token = jwt.sign({ id: User._id }, config.jwtSecret,
                    // { expiresIn: 86400 // expires in 24 hours}

                  );
                  res.status(200).send({ auth: true, token: token, user: User, message: insertObject.Message });
                })
                .catch(e => next(e));
            } else {

              res.status(403)
                .json({
                  Status: '403',
                  message: insertObject.Message
                })
                .send()
            }
          })
      } else {

        res.status(403)
          .json({
            Status: '403',
            message: IsEmailTakenObject.Message
          })
          .send()
      }
    });

}


module.exports = { login, register, logout };