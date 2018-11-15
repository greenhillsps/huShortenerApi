const AdminUser = require('../adminUser/adminUser.model');
const User = require('../user/user.model');
var bcrypt = require('bcryptjs'); // used to hash passwords
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const request = require('request');
const moment = require('moment');

const config = require('../../config/config'); // get config file

async function update(req, res, next) {

  await AdminUser.findById(req.userId, async function (err, admin) {
    if (err) {
      res.status(404);
    } else if (admin) {

      await User.findById(req.params.userId, async function (err, user) {
        if (err) {
          res.status(404);
        } else {
          console.log(req.params.userId)
          let hashedPassword = bcrypt.hashSync(req.body.password, 8);
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.password = hashedPassword;
          user.save()
            .then((savedUser) => {
              res.json(savedUser);
            })
            .catch(e => next(e));
        }
      }).then((user) => {

        AdminUser.findByIdAndUpdate(req.userId, {
          $push: {
            history: {
              date: moment().format("DD MMMM YYYY hh:mm:ss a"),
              original: user,
              changes: req.body,
            }
          }
        },
          { new: true })
          .exec((err, x) => {
            if (err) { res.status(417) }
          })
      })

    } else {
      res.status(403);
    }
  })
}

module.exports = { update };
