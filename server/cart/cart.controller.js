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
            User.findById(req.userId).lean().exec(function (err, user) {
                if (err) {
                    reject(err);
                } else if (user) {
                    console.log(user.wallet)
                    let total = 0;

                    async.parallel([

                        function (callback) {
                            if (req.body.customExpiryDate == true) {

                                Price.findOne({ name: 'customExpiryDate' }, function (err, price) {
                                    if (err) {
                                        reject(err);
                                    } else if (price) {
                                        Url.findById(id, function (err, x) {
                                            if (err) {
                                                reject(err);
                                            } else
                                                if (
                                                    // x.features.customExpiryDate.locked == true && 
                                                    user.wallet >= price.price && user.wallet > total) {
                                                    console.log("Price list for ", price.name);
                                                    customExpiryDate = true;
                                                    x.features.locked = false;
                                                    x.features.customExpiryDate.locked = false;
                                                    x.features.customExpiryDate.expiryDate = x.features.customExpiryDate.expiryDate ? moment(x.features.customExpiryDate.expiryDate).add(1, 'year') : moment().add(1, 'year');
                                                    x.features.customExpiryDate.boughtPrice = price.price;
                                                    x.features.customExpiryDate.currentPrice = price._id;
                                                    x.features.customExpiryDate.puchaseDate = moment();
                                                    x.features.customExpiryDate.totalSpent += price.price;
                                                    // x.totalAmountSpent += price.price;
                                                    x.save().then(() => {
                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success")
                                                    })
                                                }
                                                else {
                                                    console.log("customExpiryDate is either already unlocked or you don't have sufficient amount in your wallet");
                                                    callback(null, "customExpiryDate is either already unlocked or you don't have sufficient amount in your wallet");

                                                }
                                        })
                                    } else {
                                        callback(null, "Price field not found")
                                    }
                                });

                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.urlRedirectto == true) {

                                Price.findOne({ name: 'urlRedirectto' }, function (err, price) {
                                    if (err) {
                                        reject(err);
                                    } else if (price) {
                                        Url.findById(id, function (err, x) {
                                            if (err) {
                                                reject(err);
                                            } else
                                                if (
                                                    // x.features.urlRedirectto.locked == true && 
                                                    user.wallet >= price.price && user.wallet > total) {
                                                    console.log("Price list for ", price.name);

                                                    urlRedirectto = true;
                                                    x.features.locked = false;
                                                    x.features.urlRedirectto.locked = false;
                                                    x.features.urlRedirectto.expiryDate = x.features.urlRedirectto.expiryDate ? moment(x.features.urlRedirectto.expiryDate).add(1, 'year') : moment().add(1, 'year');
                                                    x.features.urlRedirectto.boughtPrice = price.price;
                                                    x.features.urlRedirectto.currentPrice = price._id;
                                                    x.features.urlRedirectto.puchaseDate = moment();
                                                    x.features.urlRedirectto.totalSpent += price.price;
                                                    // x.totalAmountSpent += price.price;
                                                    x.save().then(() => {
                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success")
                                                    })
                                                }
                                                else {
                                                    console.log("urlRedirectto is either already unlocked or you don't have sufficient amount in your wallet");
                                                    callback(null, "urlRedirectto is either already unlocked or you don't have sufficient amount in your wallet");
                                                }
                                        })
                                    } else {
                                        callback(null, "Price field not found")
                                    }
                                });

                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.enableToggle == true) {

                                Price.findOne({ name: 'enableToggle' }, function (err, price) {
                                    if (err) {
                                        callback(err);
                                    } else if (price) {
                                        Url.findById(id, function (err, x) {
                                            if (err) {
                                                reject(err);
                                            } else
                                                if (
                                                    // x.features.enableToggle.locked == true &&
                                                    user.wallet >= price.price && user.wallet > total) {
                                                    console.log("Price list for ", price.name);


                                                    enableToggle = true;
                                                    x.features.locked = false;
                                                    x.features.enableToggle.locked = false;
                                                    x.features.enableToggle.enable = true;
                                                    x.features.enableToggle.expiryDate = x.features.enableToggle.expiryDate ? moment(x.features.enableToggle.expiryDate).add(1, 'year') : moment().add(1, 'year');
                                                    x.features.enableToggle.boughtPrice = price.price;
                                                    x.features.enableToggle.currentPrice = price._id;
                                                    x.features.enableToggle.puchaseDate = moment();
                                                    x.features.enableToggle.totalSpent += price.price;
                                                    // x.totalAmountSpent += price.price;
                                                    x.save().then(() => {
                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success")
                                                    })
                                                }
                                                else {
                                                    console.log("enableToggle is either already unlocked or you don't have sufficient amount in your wallet");
                                                    callback(null, "enableToggle is either already unlocked or you don't have sufficient amount in your wallet");
                                                }
                                        });
                                    } else {
                                        callback(null, "Price field not found")
                                    }
                                });

                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.blockIps == true) {

                                Price.findOne({ name: 'blockIps' }, function (err, price) {
                                    if (err) {
                                        reject(err);
                                    } else if (price) {
                                        Url.findById(id, function (err, x) {
                                            if (err) {
                                                reject(err);
                                            } else
                                                if (
                                                    // x.features.blockIps.locked == true && 
                                                    user.wallet >= price.price && user.wallet > total) {
                                                    console.log("Price list for ", price.name);

                                                    blockIps = true;
                                                    x.features.locked = false;
                                                    x.features.blockIps.locked = false;
                                                    x.features.blockIps.expiryDate = x.features.blockIps.expiryDate ? moment(x.features.blockIps.expiryDate).add(1, 'year') : moment().add(1, 'year');
                                                    x.features.blockIps.boughtPrice = price.price;
                                                    x.features.blockIps.currentPrice = price._id;
                                                    x.features.blockIps.puchaseDate = moment();
                                                    x.features.blockIps.totalSpent += price.price;
                                                    // x.totalAmountSpent += price.price;
                                                    x.save().then(() => {
                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success");
                                                    })
                                                }
                                                else {
                                                    console.log("blockIps is either already unlocked or you don't have sufficient amount in your wallet");
                                                    callback(null, "blockIps is either already unlocked or you don't have sufficient amount in your wallet");
                                                }
                                        })
                                    } else {
                                        callback(null, "Price field not found")
                                    }
                                });

                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.customReports == true) {

                                Price.findOne({ name: 'customReports' }, function (err, price) {
                                    if (err) {
                                        reject(err);
                                    } else if (price) {
                                        Url.findById(id, function (err, x) {
                                            if (err) {
                                                reject(err);
                                            } else
                                                if (
                                                    // x.features.customReports.locked == true &&
                                                    user.wallet >= price.price && user.wallet > total) {
                                                    console.log("Price list for ", price.name);

                                                    customReports = true;
                                                    x.features.locked = false;
                                                    x.features.customReports.locked = false;
                                                    x.features.customReports.expiryDate = x.features.customReports.expiryDate ? moment(x.features.customReports.expiryDate).add(1, 'year') : moment().add(1, 'year');
                                                    x.features.customReports.boughtPrice = price.price;
                                                    x.features.customReports.currentPrice = price._id;
                                                    x.features.customReports.puchaseDate = moment();
                                                    x.features.customReports.totalSpent += price.price;
                                                    // x.totalAmountSpent += price.price;
                                                    x.save().then(() => {
                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success")
                                                    })
                                                }
                                                else {
                                                    console.log("customReports is either already unlocked or you don't have sufficient amount in your wallet");
                                                    callback(null, "customReports is either already unlocked or you don't have sufficient amount in your wallet");
                                                }
                                        })
                                    } else {
                                        callback(null, "Price field not found")
                                    }
                                });

                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.fourOfour == true) {

                                Price.findOne({ name: 'fourOfour' }, function (err, price) {
                                    if (err) {
                                        reject(err);
                                    } else if (price) {
                                        Url.findById(id, function (err, x) {
                                            if (err) {
                                                reject(err);
                                            } else
                                                if (
                                                    // x.features.fourOfour.locked == true &&
                                                    user.wallet >= price.price && user.wallet > total) {
                                                    console.log("Price list for ", price.name);

                                                    fourOfour = true;
                                                    x.features.locked = false;
                                                    x.features.fourOfour.locked = false;
                                                    x.features.fourOfour.expiryDate = x.features.fourOfour.expiryDate ? moment(x.features.fourOfour.expiryDate).add(1, 'year') : moment().add(1, 'year');
                                                    x.features.fourOfour.boughtPrice = price.price;
                                                    x.features.fourOfour.currentPrice = price._id;
                                                    x.features.fourOfour.puchaseDate = moment();
                                                    x.features.fourOfour.totalSpent += price.price;
                                                    // x.totalAmountSpent += price.price;
                                                    x.save().then(() => {
                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success")
                                                    })
                                                }
                                                else {
                                                    console.log("fourOfour is either already unlocked or you don't have sufficient amount in your wallet");
                                                    callback(null, "fourOfour is either already unlocked or you don't have sufficient amount in your wallet");
                                                }
                                        })
                                    } else {
                                        callback(null, "Price field not found")
                                    }
                                });

                            } else {
                                callback(null, "null");
                            }
                        },
                        function (callback) {
                            if (req.body.customShortUrl == true) {

                                Price.findOne({ name: 'customShortUrl' }, function (err, price) {
                                    if (err) {
                                        reject(err);
                                    } else if (price) {
                                        Url.findById(id, function (err, x) {
                                            if (err) {
                                                reject(err);
                                            } else
                                                if (
                                                    // x.features.customShortUrl.locked == true && 
                                                    user.wallet >= price.price && user.wallet > total) {
                                                    console.log("Price list for ", price.name);

                                                    customShortUrl = true;
                                                    x.features.locked = false;
                                                    x.features.customShortUrl.locked = false;
                                                    x.features.customShortUrl.expiryDate = x.features.customShortUrl.expiryDate ? moment(x.features.customShortUrl.expiryDate).add(1, 'year') : moment().add(1, 'year');
                                                    x.features.customShortUrl.boughtPrice = price.price;
                                                    x.features.customShortUrl.currentPrice = price._id;
                                                    x.features.customShortUrl.puchaseDate = moment();
                                                    x.features.customShortUrl.totalSpent += price.price;
                                                    // x.totalAmountSpent += price.price;
                                                    x.save().then(() => {

                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success")
                                                    })
                                                }
                                                else {
                                                    console.log("customShortUrl is either already unlocked or you don't have sufficient amount in your wallet");
                                                    callback(null, "customShortUrl is either already unlocked or you don't have sufficient amount in your wallet");
                                                }
                                        })
                                    } else {
                                        callback(null, "Price field not found")
                                    }
                                });

                            } else {
                                callback(null, "null");
                            }
                        }

                    ], function (err, result) {
                        if (err) {
                            console.log(" final func catch block run ", err)
                            reject(err)
                        } else {
                            if (user.wallet < total) {
                                resolve("Insufficient funds")
                            } else {
                                // console.log("final result", result)
                                // user.wallet -= total;
                                // console.log(user.wallet);
                                User.findByIdAndUpdate(req.userId, { $inc: { wallet: -total, totalAmountSpent: total } }, { new: true }).lean().exec(function (err, newuser) {
                                    if (err) {
                                        reject(err)
                                    }
                                    else {
                                        Url.findByIdAndUpdate(id, { $inc: { totalAmountSpent: total } }, { new: true }, function (err, Uurl) {
                                            if (err) {
                                                reject(err)
                                            }
                                            else {
                                                // Uurl.totalAmountSpent += total
                                                console.log("Final amount of user: ", newuser.wallet)
                                                resolve({
                                                    "TotalAmountCut": total,
                                                    "OrignalAmountInWallet": user.wallet,
                                                    "RemainingAmountInWallet": newuser.wallet,
                                                    "CustomExpiryDate": result[0],
                                                    "UrlRedirectto": result[1],
                                                    "EnableToggle": result[2],
                                                    "BlockIps": result[3],
                                                    "CustomReports": result[4],
                                                    "FourOfour": result[5],
                                                    "CustomShortUrl": result[6]
                                                });
                                            }
                                        })

                                    };
                                });
                            }
                        };
                    });
                } else {
                    resolve("No User Found");
                }
            });
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
