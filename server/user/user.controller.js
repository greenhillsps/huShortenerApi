const User = require('./user.model');
// var bcrypt = require('bcryptjs'); // used to hash passwords
// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
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


  await User.findById(req.userId, { password: 0, paymentId: 0, transactionHistory: 0 }).exec(async function (err, user) {
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
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName 
 * @property {string} req.body.lastName 
 * @property {string} req.body.password
 * @property {string} req.body.email
 * @property {string} req.body.mobileNumber 
 * @returns {User}
 */


/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {

  try {

    const { page, limit, userID, userName, paidStatus } = req.query;
    const perPage = (parseInt(limit));
    const currentPage = (parseInt(page)) || 1;
    const userIDRegex = new RegExp(userID, 'i');  // 'i' makes it case insensitive
    const userNameRegex = new RegExp(userName, 'i');  // 'i' makes it case insensitive


    const query = {
      $or: [{ firstName: userNameRegex },
      { lastName: userNameRegex }],
    }

    if (userID) {
      // console.log(userID);
      query.identity = userIDRegex;
    }
    if (paidStatus) {
      // console.log(paidStatus);
      query.paid = paidStatus
    }

    User.find(query,
      { features: 0, analytics: 0, __v: 0 })
      .sort('-_id')
      .skip((perPage * currentPage) - perPage)
      .limit(perPage)
      .exec(function (err, users) {
        if (err) {
          res.json("Error, URL not found");
        } else {
          User.find(query).exec(function (err, count) {
            if (err) {
              res.json("Error, URL not found");
            }
            else if (users == null || users == undefined) {
              res.json("Error, URL not found")
            }
            else {
              res.json({
                Users: users,
                current: currentPage,
                pages: Math.ceil(count.length / perPage),
                totalCount: count.length
              });
            }
          })
        }
      });
  } catch (error) {
    console.log(error)
    res.json(error)

  }
}
function userdetail(req, res, next) {

  let checkBody = {
    "UniqueKey": req.query.UniqueKey,
    "AccessToken": config.cdmToken
  }
  request.post(`${config.cdmUrl}customer/GetCustomerInfo`, { form: checkBody },
    async function (err, GetCustomerInfoTakenResponse, GetCustomerInfoBody) {
      let GetCustomerInfoObject = JSON.parse(GetCustomerInfoBody);
      if (err) {
        res.status(500)
          .json({
            Status: '500',
            message: GetCustomerInfoObject.Message
          })
          .send();
      }
      else if (GetCustomerInfoTakenResponse.statusCode == 200 && GetCustomerInfoObject.Result == true) {
        res.status(200).send({
          result: GetCustomerInfoObject.Result,
          message: GetCustomerInfoObject.Message,
          user: GetCustomerInfoObject.Data,

        });
      }
      else {
        res.status(403)
          .json({
            Status: '403',
            message: "Username or password is incorrect",
            result: GetCustomerInfoObject.Result,
            token: null
          })
          .send()
      }
    })
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

function customLinkUsers() {
  // try {
  //   User.find({ totalUrls: { $gt: 0 }, isActive: true, paid: true }).lean().exec(function (err, users) {
  //     if (err) {
  //       return res.status(400).json(err)
  //     }
  //     else if(!users) {
  //       return res.status(200).json(users)
  //     }
  //     else {
  //       for(let x in users){
  //         URL.find()
  //       }
  //     }
  //   })
  // }
  // catch (e) {
  //   return res.status(400).json(e)
  // }
}

module.exports = { load, get, list, remove, user, userdetail, customLinkUsers };
