const cron = require('node-cron');
const request = require('request');
const User = require('../user/user.model');
const config = require('../../config/config'); // get config file
const moment = require('moment');

let insertion = true;
let updation = true;

function insertionProcessApiRequests() {
    return new Promise((resolve, reject) => {
        insertion = false;
        User.find({ salespanel: 0 })
            .then(arr => {
                if (arr.length > 0) {
                    let resolver = "Sales Panel Leads Adding!";
                    arr.forEach(function (user, index) {

                        if (user) {
                            let lead = {
                                "CDMUniqueKey": user.uniqueKey,
                                "CustomerID": user.identity,
                                "WebsiteCode": 1,
                                "FirstName": user.firstName,
                                "LastName": user.lastName,
                                "ISOCountryCode": user.ISOCountryName,
                                "IP": user.signUpIp,
                                "CustomerStatusCode": 1,
                                "SignupDate": user.createdAt,
                                "PaymentDate": null,
                                "ClientAccessKey": config.salesClientAccessKey
                            }
                            request.post(`${config.salesUrl}Lead/InsertLead`, { form: lead },
                                function (err, leadResponse, leadBody) {
                                    let leadObject = JSON.parse(leadBody);
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    } else if (leadObject && leadResponse.statusCode == 200) {
                                        user.salespanel = 1;
                                        user.save()
                                            .then(() => {
                                                console.log(`Lead No. ${index} added!`);
                                            })
                                    } else {
                                        console.log("Nothing happened to: ", user, "at index ", index);
                                        console.log("Nothing happened on this lead body from lead: ", leadObject);
                                    }

                                })
                        }

                    });
                    resolve(resolver);
                } else {
                    resolve("No leads found!");
                }

            })
    })
}
function updationProcessApiRequests() {
    return new Promise((resolve, reject) => {
        updation = false;
        User.find({ paid: true, salespanel: 1 })
            .then(arr => {
                if (arr.length > 0) {
                    let resolver = "Sales Panel Leads updating!";
                    arr.forEach(async function (user, index) {

                        if (user) {
                            let updatedlead = {
                                "CDMUniqueKey": user.uniqueKey,
                                "CustomerStatusCode": 3,
                                "PaymentDate": user.firstPaymentDate ? user.firstPaymentDate : moment(),
                                "ClientAccessKey": config.salesClientAccessKey
                            }
                            await request.post(`${config.salesUrl}Lead/UpdateLead`, { form: updatedlead },
                                function (err, leadResponse, leadBody) {
                                    let leadObject = JSON.parse(leadBody);
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                    } else if (leadObject && leadResponse.statusCode == 200) {
                                        user.salespanel = 3;
                                        user.save()
                                            .then(() => {
                                                console.log(`Lead No. ${index} updated!`);
                                            })
                                    } else {
                                        console.log("Nothing happened", user);
                                        console.log("Nothing happened on this lead body from updated lead: ", leadObject);
                                    }
                                })
                        }
                    });
                    resolve(resolver);
                } else {
                    resolve("No paid leads found!");
                }
            })
    })
}
// console.log('cron systems initiated, looking forward to scheduled tasks at: ', moment().format("DD MMMM YYYY hh:mm:ss a"));
// cron.schedule('* * * * *', function () {
//     // console.log('cron job started at: ', moment().format("DD MMMM YYYY hh:mm:ss a"));

//     if (insertion) {
//         insertionProcessApiRequests()
//             .then(data => {
//                 // console.log(data);
//                 insertion = true;
//             })
//             .catch(err => console.log(err));
//     } else {
//         console.log("insertionProcessApiRequests running");
//     }
//     if (updation) {
//         updationProcessApiRequests()
//             .then(data => {
//                 // console.log(data);
//                 updation = true;
//             })
//             .catch(err => console.log(err));
//     } else {
//         console.log("updationProcessApiRequests running");
//     }
// })
