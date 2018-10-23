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
                    console.log(err);
                    reject(err);
                } else if (url) {

                    async.parallel([

                        function (callback) {
                            if (req.body.customExpiryDate !== null && req.body.customExpiryDate.customExpiryDate) {

                                if (url.features.locked == false && url.features.customExpiryDate.locked == false) {
                                    // console.log("customExpiryDate");
                                    url.features.customExpiryDate.customExpiryDate = moment(req.body.customExpiryDate.customExpiryDate);
                                    url.save().then(() => {
                                        // console.log("customExpiryDate success");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    // console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.urlRedirectto !== null && req.body.urlRedirectto.url) {

                                if (url.features.locked == false && url.features.urlRedirectto.locked == false) {
                                    // console.log("urlRedirectto");
                                    url.features.urlRedirectto.url = req.body.urlRedirectto.url;
                                    url.save().then(() => {
                                        // console.log("urlRedirectto success");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    // console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.enableToggle !== null && req.body.enableToggle.enable == true || req.body.enableToggle.enable == false) {

                                if (url.features.locked == false && url.features.enableToggle.locked == false) {
                                    // console.log("enableToggle");
                                    url.features.enableToggle.enable = req.body.enableToggle.enable;
                                    url.save().then(() => {
                                        // console.log("enableToggle success");
                                        callback(null, "success");
                                    });
                                }
                                else {
                                    // console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.blockIps !== null && req.body.blockIps.ips) {

                                if (url.features.locked == false && url.features.blockIps.locked == false) {
                                    // console.log("blockIps");
                                    url.features.blockIps.ips = req.body.blockIps.ips;
                                    url.save().then(() => {
                                        // console.log(" blockIps success");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    // console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.customReports !== null && req.body.customReports.type) {

                                if (url.features.locked == false && url.features.customReports.locked == false) {
                                    // console.log("customReports");
                                    url.features.customReports.type = req.body.customReports.type;
                                    url.save().then(() => {
                                        // console.log("customReports success");
                                        callback(null, "success");
                                    })
                                }
                                else {
                                    // console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.fourOfour !== null && req.body.fourOfour.url) {

                                if (url.features.locked == false && url.features.fourOfour.locked == false) {
                                    // console.log("fourOfour");
                                    url.features.fourOfour.url = req.body.fourOfour.url;
                                    url.save().then(() => {
                                        // console.log("fourOfour success");
                                        callback(null, "success");
                                    });
                                }
                                else {
                                    // console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.customShortUrl !== null && req.body.customShortUrl.shortUrl) {

                                if (url.features.locked == false && url.features.customShortUrl.locked == false) {
                                    // console.log("customShortUrl");

                                    Url.findOne({ queryKey: req.body.customShortUrl.shortUrl }).lean().exec(function (err, match) {
                                        if (err) {
                                            reject(err);
                                        } else if (match) {
                                            callback(null, "Already exist");
                                        } else {
                                            url.queryKey = req.body.customShortUrl.shortUrl;
                                            url.shortUrl = `https://dotlyapidev.herokuapp.com/${req.body.customShortUrl.shortUrl}`;

                                            url.save().then(() => {
                                                // console.log("customShortUrl success");
                                                callback(null, "success");
                                            });
                                        }
                                    });
                                    // url.features.customShortUrl.shortUrl = req.body.customShortUrl.shortUrl;

                                }
                                else {
                                    // console.log(" ");
                                    callback(null, "Feature locked");
                                }
                            } else {
                                callback(null, "null");
                            }
                        },
                    ], function (err, result) {
                        if (err) {
                            // console.log(" The Async Error ", err)
                            reject(err);
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
            // console.log(" Main catch block run ")
            reject(error)
        }
    });
}


module.exports = {
    update,
};



