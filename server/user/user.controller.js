const User = require('./user.model');
const bcrypt = require("bcryptjs");

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
     
            // let getCustomerInfoObject = JSON.parse(getCustomerInfoBody)
            res.status(200).json({
              auth: true,
              user: user,
            });
          }
        })
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
res.status(400).json({message:"empty"})
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

async function paidUsers(req, res) {
  try {
    let { userId, username } = req.query
    let page = 1, limit = 10, query = {};
    if (req.query.page) {
      page = parseInt(req.query.page)
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit)
    }
    const userIDRegex = new RegExp(userId, 'i');  // 'i' makes it case insensitive
    const userNameRegex = new RegExp(username, 'i');  // 'i' makes it case insensitive

    if (userId) {
      query.identity = userIDRegex;
    }
    if (username) {
      query = {
        $or: [{ firstName: userNameRegex },
        { lastName: userNameRegex }],
      }
    }

    query['totalURLS'] = { $gt: 0 }
    query['paid'] = true

    await User.find(query)
      .select('_id identity firstName lastName paid totalURLS ISOCountryName')
      .limit(limit)
      .skip((page * limit) - limit)
      .lean()
      .exec(async function (err, users) {
        if (err) {
          return res.status(400).json(err)
        }
        else if (!users) {
          let obj = {
            users: users,
            current: page,
            pages: 0,
            totalCount: 0
          }
          return res.status(200).json(obj)
        }
        else {
          let count = await User.count({ totalURLS: { $gt: 0 }, paid: true })
          let obj = {
            users: users,
            current: page,
            pages: Math.floor(count / limit + 1),
            totalCount: count
          }
          return res.status(200).json(obj)
        }
      })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}
async function updateUser(req, res, next){
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const user={
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
    email: req.body.email,
    phoneNumber: req.body.mobileNum,
  };
  User.findByIdAndUpdate(req.userId,{...user}, { new: true }, (err, data) => {
    if (err) res.status(400).json(err)
    else res.status(200).json(data)
})
};

module.exports = { load, get, list, remove, user, userdetail, paidUsers,updateUser };
