const AdminUser = require('../adminUser/adminUser.model');
const User = require('../user/user.model');
var bcrypt = require('bcryptjs'); // used to hash passwords
// const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const request = require('request');
const moment = require('moment');

const config = require('../../config/config'); // get config file

async function update(req, res, next) {

  await AdminUser.findById(req.userId, async function (err, admin) {
    if (err) {
      res.status(404);
    } else if (admin) {

      await User.findById(req.params.userId, async function (err, user) {
        console.log(user)
        if (err) {
          res.status(404);
        } else {

          let updateBody = {
            "FirstName": req.body.FirstName,
            "LastName": req.body.LastName,
            "Password": req.body.Password,
            "Email": req.body.Email,
            "CountryCode": req.body.CountryCode,
            "PhoneNumber": req.body.PhoneNumber,
            "UniqueKey": req.body.UniqueKey,
            "AccessToken": config.cdmToken,

          }
          request.post(`${config.cdmUrl}customer/UpdateCustomerInfo`, { form: updateBody },
            async function (err, UpdateCustomerInfoResponse, UpdateCustomerInfoBody) {
              let UpdateCustomerInfoObject = JSON.parse(UpdateCustomerInfoBody);
              if (err) {
                res.status(400)
                  .json({
                    Status: '400',
                    message: UpdateCustomerInfoObject.Message
                  })
                  .send();
              }
              else if (UpdateCustomerInfoResponse.statusCode == 200 && UpdateCustomerInfoObject.Result == true) {
                let hashedPassword = bcrypt.hashSync(req.body.Password, 8);
                user.firstName = req.body.FirstName;
                user.lastName = req.body.LastName;
                user.password = hashedPassword;
                console.log("1")
                user.save()
                  .then((savedUser) => {
                    console.log("2")
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
                        console.log("3")
                        if (err) { res.status(400) }
                        else {
                          console.log("4")
                          res.json({ User: savedUser, CdmUpdate: UpdateCustomerInfoObject.Result, Data: UpdateCustomerInfoObject });
                        }
                      })
                    // .then((savedUser) => {

                    // })
                    // .catch(e => next(e));
                  })

                  .catch(e => next(e));
              }
              else {
                console.log("5")
                res.status(403)
                  .json({
                    Status: '403',
                    message: UpdateCustomerInfoObject.Message,
                    result: UpdateCustomerInfoObject.Result,
                    token: null
                  })
                  .send()
              }
            })


        }
      })

    } else {
      console.log("6")
      res.send(403);
    }
  })
}

module.exports = { update };
