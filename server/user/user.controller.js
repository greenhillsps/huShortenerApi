const User = require('./user.model');
var bcrypt = require('bcryptjs'); // used to hash passwords
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const request = require('request');

const config = require('../../config/config'); // get config file
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

async function user(req, res, next) {


  await User.findById(req.userId, '-password').exec(async function (err, user) {
    // console.log("user id from find user from users", req.userId)
    if (err) {
      res.status(403).json({ msg: "User not found", auth: false });
    } else if (user) {
      let getCustomerInfo = {
        "UniqueKey": user.uniqueKey
        ,
        "AccessToken": config.cdmToken
      }

      await request.post(`${config.cdmUrl}customer/GetCustomerInfo`, { form: getCustomerInfo },
        async function (err, getCustomerInfoResponse, getCustomerInfoBody) {
          if (err) {
            res.status(403).json({ msg: "User not found", auth: false });
          } else if (getCustomerInfoResponse.statusCode == 200) {

            let getCustomerInfoObject = JSON.parse(getCustomerInfoBody)
            res.status(200).json({
              auth: true,
              user: user,
              email: getCustomerInfoObject.Data.Email,
              countryCode: getCustomerInfoObject.Data.CountryCode,
              phoneNumber: getCustomerInfoObject.Data.PhoneNumber
            });
          } else {
            res.status(403).json({ msg: "User not found", auth: false });
          }
        })

    } else {
      res.status(403).json({ msg: "User not found", auth: false });
    }
  });
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
 * @returns {User}
 */
// async function create(req, res, next) {

//   if (await User.findOne({ email: req.body.email })) {

//     res.status(403)
//       .json({
//         Status: '403',
//         message: ' email ' + req.body.email + ' is already taken'
//       })
//       .send()
//   } else {
//     var hashedPassword = bcrypt.hashSync(req.body.password, 8);
//     const user = new User({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       password: hashedPassword,
//       email: req.body.email,
//       mobileNumber: req.body.mobileNumber
//     });

//     var token = jwt.sign({ email: req.body.email }, config.jwtSecret, {
//       // expiresIn: 86400 // expires in 24 hours
//     });

//     await user.save()
//       .then(User => res.status(200).send({ auth: true, token: token, User}))
//       .catch(e => next(e));
//   }
// }

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName 
 * @property {string} req.body.lastName 
 * @property {string} req.body.password
 * @property {string} req.body.email
 * @property {string} req.body.mobileNumber 
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.password = req.body.password;
  user.email = req.body.email;
  user.mobileNumber = req.body.mobileNumber;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit, skip } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, update, list, remove, user };
