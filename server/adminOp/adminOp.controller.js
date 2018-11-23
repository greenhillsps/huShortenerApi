const AdminUser = require("../adminUser/adminUser.model");
const User = require("../user/user.model");
var bcrypt = require("bcryptjs"); // used to hash passwords
// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const request = require("request");
const moment = require("moment");
const Url = require('../url/url.model')
const config = require("../../config/config"); // get config file

async function update(req, res, next) {
  await AdminUser.findById(req.userId, async function (err, admin) {
    if (err) {
      res.status(404);
    } else if (admin) {
      await User.findById(req.params.userId, async function (err, user) {
        if (err) {
          res.status(404);
        } else if (!user) {
          res.status(404);
        } else {
          let updateBody = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            // Password: req.body.Password,
            Email: req.body.Email,
            CountryCode: req.body.CountryCode,
            PhoneNumber: req.body.PhoneNumber,
            UniqueKey: req.body.UniqueKey,
            AccessToken: config.cdmToken
          };
          request.post(
            `${config.cdmUrl}customer/UpdateCustomerInfo`,
            { form: updateBody },
            async function (
              err,
              UpdateCustomerInfoResponse,
              UpdateCustomerInfoBody
            ) {
              let UpdateCustomerInfoObject = JSON.parse(UpdateCustomerInfoBody);
              if (err) {
                res
                  .status(400)
                  .json({
                    Status: "400",
                    message: UpdateCustomerInfoObject.Message
                  })
                  .send();
              } else if (
                UpdateCustomerInfoResponse.statusCode == 200 &&
                UpdateCustomerInfoObject.Result == true
              ) {
                // let hashedPassword = bcrypt.hashSync(req.body.Password, 8);
                user.firstName = req.body.FirstName;
                user.lastName = req.body.LastName;
                // user.password = hashedPassword;
                user
                  .save()
                  .then(savedUser => {
                    AdminUser.findByIdAndUpdate(
                      req.userId,
                      {
                        $push: {
                          history: {
                            date: moment().format("DD MMMM YYYY hh:mm:ss a"),
                            original: user,
                            changes: req.body
                          }
                        }
                      },
                      { new: true }
                    ).exec((err, x) => {
                      if (err) {
                        res.status(400);
                      } else {
                        res.json({
                          username: `${savedUser.firstName} ${
                            savedUser.lastName
                            }`,
                          CdmUpdate: UpdateCustomerInfoObject.Result,
                          Data: UpdateCustomerInfoObject
                        });
                      }
                    });
                    // .then((savedUser) => {

                    // })
                    // .catch(e => next(e));
                  })

                  .catch(e => next(e));
              } else {
                res
                  .status(403)
                  .json({
                    Status: "403",
                    message: UpdateCustomerInfoObject.Message,
                    result: UpdateCustomerInfoObject.Result,
                    token: null
                  })
                  .send();
              }
            }
          );
        }
      });
    } else {
      res.send(403);
    }
  });
}

async function updatePassword(req, res, next) {
  await AdminUser.findById(req.userId, async function (err, admin) {
    if (err || !req.body.password) return res.status(400);
    else if (admin) {
      let hashedPassword = bcrypt.hashSync(req.body.password, 8);

      await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { password: hashedPassword },
        { new: false },
        async function (err, user) {
          if (err) {
            res.status(400).send();
          } else if (!user) {
            res.status(404).send();
          } else {
            AdminUser.findByIdAndUpdate(
              req.userId,
              {
                $push: {
                  history: {
                    date: moment().format("DD MMMM YYYY hh:mm:ss a"),
                    original: {
                      user: user._id,
                      password: user.password
                    },
                    changes: {
                      password: `${hashedPassword}`
                    }
                  }
                }
              },
              { new: true }
            ).exec((err, x) => {
              if (err) {
                res.status(400).send();
              } else {
                res.json({
                  username: `${user.firstName} ${user.lastName}`,
                  Data: "Password Changed!"
                });
              }
            });
          }
        }
      );
    }
  });
}

async function getUrlByUser(req, res) {
  await AdminUser.findById(req.userId, async function (err, admin) {
    if (err) {
      res.status(400);
    } else if (admin) {
      if (!req.params.userId) {
        res.status(400).json("UserId not found!");
      } else {
        Url.find({ user: req.params.userId, isActive: true })
          .select('_id title shortUrl actualUrl createdAt')
          .lean()
          .exec(async function (err, url) {
            if (err)
              res.status(400).json(err)
            else {
              return res.status(200).json(url)
            }
          })
      }
    }
  })
}

async function urlAnalytics(req, res) {
  // if (!req.params.urlId) {
  //   return res.status(400).json("Url id not found!");
  // }
  // else {
  //   await Url.findById(req.params.urlId).select('_id title analytics').lean().exec(async function (err, urls) {
  //     if (err)
  //       return res.status(400).json(err);
  //     else {
  //       return res.status(200).json(urls)
  //     }
  //   })
  // }
}


module.exports = { update, updatePassword, getUrlByUser, urlAnalytics };
