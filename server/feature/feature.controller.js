const mongoose = require('mongoose');
const db = require('../../config/db');
const Url = db.Url;
const Price = db.Price;
const User = require('../user/user.model');
var async = require("async");
const moment = require('moment');
const ObjectId = mongoose.Types.ObjectId;
var shortid = require('shortid');

function update(id, req) {
    return new Promise((resolve, reject) => {

        try {
            Url.findById(id, function (err, url) {
                if (err) {
                    reject(err);
                } else if (url) {

                    async.parallel([

                        function (callback) {
                            if (req.body.customExpiryDate == true) {

                                if (url.features.locked == true && url.features.customExpiryDate.locked == true) {
                                    console.log("customExpiryDate");
                                    url.features.customExpiryDate.customExpiryDate = req.body.customExpiryDate.customExpiryDate;
                                    url.save().then(after => {
                                        console.log(" ");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.urlRedirectto == true) {

                                if (url.features.locked == true && url.features.urlRedirectto.locked == true) {
                                    console.log("urlRedirectto");
                                    url.features.urlRedirectto.urlRedirectto = req.body.urlRedirectto.urlRedirectto;
                                    url.save().then(after => {
                                        console.log(" ");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.enableToggle == true) {

                                if (url.features.locked == true && url.features.enableToggle.locked == true) {
                                    console.log("enableToggle");
                                    url.features.enableToggle.enableToggle = req.body.enableToggle.enableToggle;
                                    url.save().then(after => {
                                        console.log(" ");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.blockIps == true) {

                                if (url.features.locked == true && url.features.blockIps.locked == true) {
                                    console.log("blockIps");
                                    url.features.blockIps.blockIps = req.body.blockIps.blockIps;
                                    url.save().then(after => {
                                        console.log(" ");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.customReports == true) {

                                if (url.features.locked == true && url.features.customReports.locked == true) {
                                    console.log("customReports");
                                    url.features.customReports.customReports = req.body.customReports.customReports;
                                    url.save().then(after => {
                                        console.log(" ");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.fourOfour == true) {

                                if (url.features.locked == true && url.features.fourOfour.locked == true) {
                                    console.log("fourOfour");
                                    url.features.fourOfour.fourOfour = req.body.fourOfour.fourOfour;
                                    url.save().then(after => {
                                        console.log(" ");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.customShortUrl == true) {

                                if (url.features.locked == true && url.features.customShortUrl.locked == true) {
                                    console.log("customShortUrl");
                                    url.features.customShortUrl.customShortUrl = req.body.customShortUrl.customShortUrl;
                                    url.save().then(after => {
                                        console.log(" ");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                    ], function (err, result) {
                        if (err) {
                            console.log(" ", err)
                            reject(err)
                        } else {
                            if (!result) {
                                resolve("Some Error")
                            } else {
                                resolve(result);
                            }
                        };
                    })
                } else {
                    resolve("Url not found")
                }
            })
        } catch (error) {
            console.log(" Main catch block run ")
            reject(error)
        }
    });
}


module.exports = {
    update,
};


// chart= ["11,feb,2018","13,march,2019"] 

// [
//     {
//         month :'sep-2016',
//         clicks:23
//     },
//     {
//         month :'sep-2017',
//         clicks:23
//     }
// ]
