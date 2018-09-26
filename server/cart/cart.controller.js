const mongoose = require('mongoose');
const db = require('../../config/db');
const Url = db.Url;
const Price = db.Price;
const User = require('../user/user.model');
var async = require("async");
const ObjectId = mongoose.Types.ObjectId;
var shortid = require('shortid');
module.exports = {
    update,
};

function update(id, req) {
    return new Promise((resolve, reject) => {

        try {
            User.findById(req.userId).lean().exec(function (err, user) {
                console.log(user.wallet)
                // let customExpiryDate = false;
                // let urlRedirectto = false;
                // let enableToggle = false;
                // let blockIps = false;
                // let customReports = false;
                // let fourOfour = false;
                // let customShortUrl = false;
                let total = 0;


                async.parallel([

                    function (callback) {
                        if (req.body.customExpiryDate == true) {

                            Price.findById('5b9a22f0c597034450c4c8de', function (err, price) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Url.findById(id, function (err, x) {
                                        if (err) {
                                            console.log(err)
                                        } else
                                            if (x.features.customExpiryDate.locked == true && user.wallet > price.price) {
                                                console.log("Price list for ", price.name);

                                                // try {
                                                customExpiryDate = true;
                                                x.features.locked = false;
                                                x.features.customExpiryDate.locked = false;
                                                x.save().then(after => {
                                                    let wallet = user.wallet - price.price;
                                                    // Object.assign(user.wallet, wallet);
                                                    // user.save().then(x => {
                                                    //     console.log("Updated User", x)
                                                    // })
                                                    //     .catch(err => {
                                                    //         console.log("updated user error", err)
                                                    //     })
                                                    console.log(price.price, "has been cut ");
                                                    total += price.price;
                                                    callback(null, "success")
                                                })


                                                // } catch (error) {
                                                //     console.log("error one", error)
                                                //     callback(error)
                                                // }
                                            }
                                            else {
                                                console.log("customExpiryDate is either already unlocked or you don't have sufficient amount in your wallet");
                                                callback(null, "customExpiryDate is either already unlocked or you don't have sufficient amount in your wallet");

                                            }
                                    })
                                }
                            });

                        } else {
                            callback(null, "null");
                        }
                    },
                    function (callback) {
                        if (req.body.urlRedirectto == true) {

                            Price.findById('5b9a2306c597034450c4c8df', function (err, price) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Url.findById(id, function (err, x) {
                                        if (err) {
                                            console.log(err)
                                        } else
                                            if (x.features.urlRedirectto.locked == true && user.wallet > price.price) {
                                                console.log("Price list for ", price.name);

                                                // try {
                                                urlRedirectto = true;
                                                x.features.locked = false;
                                                x.features.urlRedirectto.locked = false;
                                                x.save().then(after => {
                                                    let wallet = user.wallet - price.price;
                                                    // Object.assign(user.wallet, wallet);
                                                    // user.save().then(x => {
                                                    //     console.log("Updated User", x)
                                                    // })
                                                    //     .catch(err => {
                                                    //         console.log("updated user error", err)
                                                    //     })
                                                    console.log(price.price, "has been cut ");
                                                    total += price.price;
                                                    callback(null, "success")
                                                })
                                                // } catch (error) {
                                                //     callback(error)
                                                // }
                                            }
                                            else {
                                                console.log("urlRedirectto is either already unlocked or you don't have sufficient amount in your wallet");
                                                callback(null, "urlRedirectto is either already unlocked or you don't have sufficient amount in your wallet");
                                            }
                                    })
                                }
                            });

                        } else {
                            callback(null, "null");
                        }
                    },
                    function (callback) {
                        if (req.body.enableToggle == true) {

                            Price.findById('5b9a230fc597034450c4c8e0', function (err, price) {
                                if (err) {
                                    callback(err);
                                } else {
                                    Url.findById(id, function (err, x) {
                                        if (err) {
                                            console.log(err)
                                        } else
                                            if (x.features.enableToggle.locked == true && user.wallet > price.price) {
                                                console.log("Price list for ", price.name);

                                                // try {
                                                enableToggle = true;
                                                x.features.locked = false;
                                                x.features.enableToggle.locked = false;
                                                x.save().then(after => {
                                                    let wallet = user.wallet - price.price;
                                                    // Object.assign(user.wallet, wallet);
                                                    // user.save().then(x => {
                                                    //     console.log("Updated User", x)
                                                    // })
                                                    //     .catch(err => {
                                                    //         console.log("updated user error", err)
                                                    //     })
                                                    console.log(price.price, "has been cut ");
                                                    total += price.price;
                                                    callback(null, "success")
                                                })

                                                // } catch (error) {
                                                //     callback(error)
                                                // }
                                            }
                                            else {
                                                console.log("enableToggle is either already unlocked or you don't have sufficient amount in your wallet");
                                                callback(null, "enableToggle is either already unlocked or you don't have sufficient amount in your wallet");
                                            }
                                    })

                                }
                            });

                        } else {
                            callback(null, "null");
                        }
                    },
                    function (callback) {
                        if (req.body.blockIps == true) {

                            Price.findById('5b9a2316c597034450c4c8e1', function (err, price) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Url.findById(id, function (err, x) {
                                        if (err) {
                                            console.log(err)
                                        } else
                                            if (x.features.blockIps.locked == true && user.wallet > price.price) {
                                                console.log("Price list for ", price.name);

                                                // try {
                                                blockIps = true;
                                                x.features.locked = false;
                                                x.features.blockIps.locked = false;
                                                x.save().then(after => {
                                                    let wallet = user.wallet - price.price;
                                                    // Object.assign(user.wallet, wallet);
                                                    // user.save().then(x => {
                                                    //     console.log("Updated User", x)
                                                    // })
                                                    //     .catch(err => {
                                                    //         console.log("updated user error", err)
                                                    //     })
                                                    console.log(price.price, "has been cut ");
                                                    total += price.price;
                                                    callback(null, "success");
                                                })


                                                // } catch (error) {
                                                //     callback(error)
                                                // }
                                            }
                                            else {
                                                console.log("blockIps is either already unlocked or you don't have sufficient amount in your wallet");
                                                callback(null, "blockIps is either already unlocked or you don't have sufficient amount in your wallet");
                                            }
                                    })
                                }
                            });

                        } else {
                            callback(null, "null");
                        }
                    },
                    function (callback) {
                        if (req.body.customReports == true) {

                            Price.findById('5b9a231cc597034450c4c8e2', function (err, price) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Url.findById(id, function (err, x) {
                                        if (err) {
                                            console.log(err)
                                        } else
                                            if (x.features.customReports.locked == true && user.wallet > price.price) {
                                                console.log("Price list for ", price.name);
                                                // try {
                                                customReports = true;
                                                x.features.locked = false;
                                                x.features.customReports.locked = false;
                                                x.save().then(after => {
                                                    let wallet = user.wallet - price.price;
                                                    // Object.assign(user.wallet, wallet);
                                                    // user.save().then(x => {
                                                    //     console.log("Updated User", x)
                                                    // })
                                                    //     .catch(err => {
                                                    //         console.log("updated user error", err)
                                                    //     })
                                                    console.log(price.price, "has been cut ");
                                                    total += price.price;
                                                    callback(null, "success")
                                                })


                                                // } catch (error) {
                                                //     callback(error)
                                                // }
                                            }
                                            else {
                                                console.log("customReports is either already unlocked or you don't have sufficient amount in your wallet");
                                                callback(null, "customReports is either already unlocked or you don't have sufficient amount in your wallet");
                                            }
                                    })
                                }
                            });

                        } else {
                            callback(null, "null");
                        }
                    },
                    function (callback) {
                        if (req.body.fourOfour == true) {

                            Price.findById('5b9a2323c597034450c4c8e3', function (err, price) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Url.findById(id, function (err, x) {
                                        if (err) {
                                            console.log(err);
                                        } else
                                            if (x.features.fourOfour.locked == true && user.wallet > price.price) {
                                                console.log("Price list for ", price.name);

                                                // try {
                                                fourOfour = true;
                                                x.features.locked = false;
                                                x.features.fourOfour.locked = false;
                                                x.save().then(
                                                    after => {
                                                        let wallet = user.wallet - price.price;
                                                        // Object.assign(user.wallet, wallet);
                                                        // user.save().then(x => {
                                                        //     console.log("Updated User", x)
                                                        // })
                                                        //     .catch(err => {
                                                        //         console.log("updated user error", err)
                                                        //     })
                                                        console.log(price.price, "has been cut ");
                                                        total += price.price;
                                                        callback(null, "success")
                                                    }
                                                )


                                                // } catch (error) {
                                                //     callback(error)
                                                // }
                                            }
                                            else {
                                                console.log("fourOfour is either already unlocked or you don't have sufficient amount in your wallet");
                                                callback(null, "fourOfour is either already unlocked or you don't have sufficient amount in your wallet");
                                            }
                                    })
                                }
                            });

                        } else {
                            callback(null, "null");
                        }
                    },
                    function (callback) {
                        if (req.body.customShortUrl == true) {

                            Price.findById('5b9a238ec597034450c4c8e4', function (err, price) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Url.findById(id, function (err, x) {
                                        if (err) {
                                            console.log(err)
                                        } else
                                            if (x.features.customShortUrl.locked == true && user.wallet > price.price) {
                                                console.log("Price list for ", price.name);

                                                // try {
                                                customShortUrl = true;
                                                x.features.locked = false;
                                                x.features.customShortUrl.locked = false;
                                                x.save().then(after => {
                                                    let wallet = user.wallet - price.price;
                                                    // Object.assign(user.wallet, wallet);
                                                    // user.save().then(x => {
                                                    //     console.log("Updated User", x)
                                                    // })
                                                    //     .catch(err => {
                                                    //         console.log("updated user error", err)
                                                    //     })
                                                    console.log(price.price, "has been cut ");
                                                    total += price.price;
                                                    callback(null, "success")
                                                })


                                                // } catch (error) {
                                                //     callback(error)
                                                // }
                                            }
                                            else {
                                                console.log("customShortUrl is either already unlocked or you don't have sufficient amount in your wallet");
                                                callback(null, "customShortUrl is either already unlocked or you don't have sufficient amount in your wallet");
                                            }
                                    })
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
                        console.log("final result", result)
                        user.wallet -= total;
                        console.log(user.wallet);
                        user.save();
                        resolve({
                            "totalAmountCut": total,
                            "customExpiryDate": result[0],
                            "urlRedirectto": result[1],
                            "enableToggle": result[2],
                            "blockIps": result[3],
                            "customReports": result[4],
                            "fourOfour": result[5],
                            "customShortUrl": result[6]
                        });
                    }
                });
            });
        } catch (error) {
            console.log(" Main catch block run ")
            reject(error)
        }


    });
}


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
