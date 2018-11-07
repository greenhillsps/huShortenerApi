const cron = require('node-cron');
const request = require('request');
const User = require('../user/user.model');
const config = require('../../config/config'); // get config file
console.log('Sales Panel Scheduler run');
let ku = cron.schedule('* 1 * * *', function () {

    User.find({ salespanel: false })
        .then(arr => {
            arr.forEach(async function (user) {

                if (user) {
                    let lead = {
                        "CDMUniqueKey": user.uniqueKey,
                        "CustomerID": user.id,
                        "WebsiteCode": 1,
                        "FirstName": user.firstName,
                        "LastName": user.lastName,
                        "ISOCountryCode": user.ISOCountryCode,
                        "IP": user.signUpIp,
                        "CustomerStatusCode": 1,
                        "SignupDate": user.createdAt,
                        "PaymentDate": null,
                        "ClientAccessKey": config.salesClientAccessKey
                    }
                    // console.log(lead)
                    await request.post(`${config.salesUrl}Lead/InsertLead`, { form: lead },
                        function (err, leadResponse, leadBody) {
                            console.log("Request send");
                            let leadObject = JSON.parse(leadBody);
                            if (err) {
                                console.log(err);
                                console.log(leadObject);
                            } else if (leadObject) {
                                console.log("lead body from lead: ", leadObject)
                                user.salespanel = true;
                                user.save().then(() => {
                                    console.log("Sales Panel Lead Added!")
                                })
                            } else {
                                console.log("Nothing happened")
                                console.log("lead body from lead: ", leadObject)
                                // console.log("response: ", leadResponse)
                            }
                        })
                }
            });
        })

    console.log('Sales Panel Scheduler run, No lead found!');
});

module.exports = { ku };