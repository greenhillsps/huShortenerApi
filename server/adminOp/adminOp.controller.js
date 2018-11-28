const AdminUser = require("../adminUser/adminUser.model");
const User = require("../user/user.model");
var bcrypt = require("bcryptjs"); // used to hash passwords
// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const request = require("request");
const moment = require("moment");
const Url = require('../url/url.model')
const config = require("../../config/config"); // get config file
var _ = require('lodash');

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
  if (!req.params.urlId) {
    return res.status(400).json("Url id not found!");
  }
  else if (!req.query.time) {
    return res.status(400).json("Please specify time!")
  }
  else {
    let urlId = req.params.urlId, time = req.query.time
    await Url.findById(urlId).select('_id title analytics').lean().exec(async function (err, urls) {
      if (err)
        return res.status(400).json(err);
      else {
        let analytics = urls.analytics
        let totalClicks = analytics.length
        let lastClick = analytics.length ? analytics[analytics.length - 1].clickDate : null, count = 0
        for (let x in analytics) {
          let clickDate = analytics[x].clickDate
          let today = moment().format('DD-MM-YYYY')
          let date = moment(clickDate).format('DD-MM-YYYY')
          let month = moment(clickDate).format('MM-YYYY')
          analytics[x].date = date
          analytics[x].month = month
          if (today == date) {
            count++
          }
        }

        if (time == 'daily') {
          var groups = _(analytics)
            .groupBy(x => x.date)
            .map((value, key) => ({ label: key, value: value.length }))
            .value();
          let obj = {
            totalClicks: totalClicks,
            lastClick: lastClick,
            todayClicks: count,
            data: groups
          }
          return res.status(200).json(obj);
        }
        else if (time == 'monthly') {
          var groups = _(analytics)
            .groupBy(x => x.month)
            .map((value, key) => ({ label: key, value: value.length }))
            .value();
          let obj = {
            totalClicks: totalClicks,
            lastClick: lastClick,
            todayClicks: count,
            data: groups
          }
          return res.status(200).json(obj)
        }
      }
    })
  }
}

/**********Custom Expiry feature Methods***********/
async function customExpiryUrls(req, res) {   // Get all urls of a user with set custom expiry date feature enabled
  try {
    Url.find({ user: req.params.userId, "features.customExpiryDate.locked": false, isActive: true }).lean().exec(function (err, urls) {
      if (err)
        return res.status(400).json(err)
      else {
        return res.status(200).json(urls)
      }
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

async function updateCustomExpiry(req, res) {   // Update expiry date of a url
  try {
    let { urlId } = req.params
    let { expiryDate } = req.body
    if (!urlId) { return res.status(400).json("Invalid Id") }
    await Url.findByIdAndUpdate({ _id: urlId }, { 'features.customExpiryDate.customExpiryDate': expiryDate }, { safe: true, new: true }).lean().exec(async function (err, url) {
      if (err)
        return res.status(400).json(err)
      else
        return res.status(200).json(url)
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

/**********Destination Link (aka) URL Redirect To  Methods***********/
async function redirectToUrls(req, res) {   // Get all urls of a user with Redirect To feature enabled
  try {
    Url.find({ user: req.params.userId, "features.urlRedirectto.locked": false, isActive: true }).lean().exec(function (err, urls) {
      if (err)
        return res.status(400).json(err)
      else {
        return res.status(200).json(urls)
      }
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

async function updateUrlRedirect(req, res) {    // Update url to redirect from actual url
  try {
    let { urlId } = req.params
    let { urlRedirectTo } = req.body
    if (!urlId) { return res.status(400).json("Invalid Id") }
    await Url.findByIdAndUpdate({ _id: urlId }, { 'features.urlRedirectto.url': urlRedirectTo }, { safe: true, new: true }).lean().exec(async function (err, url) {
      if (err)
        return res.status(400).json(err)
      else
        return res.status(200).json(url)
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

/**********404 Management Methods***********/
async function fourOFourUrls(req, res) {  // Get all urls of a user with 404 management feature enabled
  try {
    Url.find({ user: req.params.userId, "features.fourOfour.locked": false, isActive: true }).lean().exec(function (err, urls) {
      if (err)
        return res.status(400).json(err)
      else {
        return res.status(200).json(urls)
      }
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

async function updateFourOFourUrls(req, res) {    // Update URL to redirect on, if an actual url page is not found
  try {
    let { urlId } = req.params
    let { urlRedirectTo } = req.body
    if (!urlId) { return res.status(400).json("Invalid Id") }
    await Url.findByIdAndUpdate({ _id: urlId }, { 'features.fourOfour.url': urlRedirectTo }, { safe: true, new: true }).lean().exec(async function (err, url) {
      if (err)
        return res.status(400).json(err)
      else
        return res.status(200).json(url)
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}


/**********Black List Protection Methods***********/
async function blackListProtectedUrls(req, res) {       // Get all urls of a user with blacklist protection feature enabled
  try {
    Url.find({ user: req.params.userId, "features.blockIps.locked": false, isActive: true }).lean().exec(function (err, urls) {
      if (err)
        return res.status(400).json(err)
      else {
        return res.status(200).json(urls)
      }
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

async function updateBlackListIPs(req, res) {     // Update blacklisted IPs of a url
  try {
    let { urlId } = req.params
    let { ips } = req.body
    if (!urlId) { return res.status(400).json("Invalid Id") }
    await Url.findByIdAndUpdate({ _id: urlId }, { 'features.blockIps.ips': ips }, { safe: true, new: true }).lean().exec(async function (err, url) {
      if (err)
        return res.status(400).json(err)
      else
        return res.status(200).json(url)
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

/**********Activate / Deactivate URLs Methods***********/
async function toggleActivationUrls(req, res) {       // Get all urls of a user with active/inactive feature enabled
  try {
    Url.find({ user: req.params.userId, "features.enableToggle.locked": false, isActive: true }).lean().exec(function (err, urls) {
      if (err)
        return res.status(400).json(err)
      else {
        return res.status(200).json(urls)
      }
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}

async function toggleActivationOfUrl(req, res) {     // Update blacklisted IPs of a url
  try {
    let { urlId } = req.params
    let { enable } = req.body
    if (!urlId) { return res.status(400).json("Invalid Id") }
    await Url.findByIdAndUpdate({ _id: urlId }, { 'features.enableToggle.enable': enable }, { safe: true, new: true }).lean().exec(async function (err, url) {
      if (err)
        return res.status(400).json(err)
      else
        return res.status(200).json(url)
    })
  }
  catch (e) {
    return res.status(400).json(e)
  }
}


module.exports = { update, updatePassword, getUrlByUser, urlAnalytics, customExpiryUrls, updateCustomExpiry, redirectToUrls, updateUrlRedirect, fourOFourUrls, updateFourOFourUrls, blackListProtectedUrls, updateBlackListIPs, toggleActivationUrls, toggleActivationOfUrl };
