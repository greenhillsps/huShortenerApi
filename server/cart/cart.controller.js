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

async function update(id, req) {

    try {

        const user = await User.findById(req.userId);
        console.log(user.wallet)
        let customExpiryDate = false;
        let urlRedirectto = false;
        let enableToggle = false;
        let blockIps = false;
        let customReports = false;
        let fourOfour = false;
        let customShortUrl = false;
        let total = 0;
        if (req.body.customExpiryDate == true) {
            let price;
            await Price.findById('5b9a22f0c597034450c4c8de', async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    price = doc;
                    // console.log("internal price: ",price);
                }
            });
            await Url.findById(id, async function (err, x) {
                if (err) {
                    console.log(err)
                } else
                    if (await x.features.customExpiryDate.locked == true && await user.wallet > await price.price) {
                        await console.log("Price list for ", price.name);

                        customExpiryDate = true;
                        x.features.locked = false;
                        x.features.customExpiryDate.locked = false;
                        await x.save();

                        user.wallet = await user.wallet - await price.price;
                        await user.save().then(() => {
                            console.log(price.price, "has been cut ");
                            total += price.price;
                        });
                    }
                    else {
                        console.log("Feature is either already unlocked or you don't have sufficient amount in your wallet");
                    }
            })
        }
        if (req.body.urlRedirectto == true) {
            let price;
            await Price.findById('5b9a2306c597034450c4c8df', async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    price = doc;
                    // console.log("internal price: ",price);
                }
            });
            await Url.findById(id, async function (err, x) {
                if (err) {
                    console.log(err)
                } else
                    if (await x.features.urlRedirectto.locked == true && await user.wallet > await price.price) {
                        console.log("Price list for ", price.name);
                        urlRedirectto = true;
                        x.features.locked = false;
                        x.features.urlRedirectto.locked = false;
                        await x.save();

                        user.wallet = await user.wallet - await price.price;
                        await user.save().then(() => {
                            console.log(price.price, "has been cut ");
                            total += price.price;
                        });
                    }
                    else {
                        console.log("Feature is either already unlocked or you don't have sufficient amount in your wallet");
                    }

            })
        };
        if (req.body.enableToggle == true) {
            let price;
            await Price.findById('5b9a230fc597034450c4c8e0', async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    price = doc;
                    // console.log("internal price: ",price);
                }
            });
            await Url.findById(id, async function (err, x) {
                if (err) {
                    console.log(err)
                } else
                    if (await x.features.enableToggle.locked == true && await user.wallet > await price.price) {
                        console.log("Price list for ", price.name);
                        enableToggle = true;
                        x.features.locked = false;
                        x.features.enableToggle.locked = false;
                        await x.save();

                        user.wallet = await user.wallet - await price.price;
                        await user.save().then(() => {
                            console.log(price.price, "has been cut ");
                            total += price.price;
                        });
                    }
                    else {
                        console.log("Feature is either already unlocked or you don't have sufficient amount in your wallet");
                    }
            })
        };
        if (req.body.blockIps == true) {
            let price;
            await Price.findById('5b9a2316c597034450c4c8e1', async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    price = doc;
                    // console.log("internal price: ",price);
                }
            });
            await Url.findById(id, async function (err, x) {
                if (err) {
                    console.log(err)
                } else
                    if (await x.features.blockIps.locked == true && await user.wallet > await price.price) {
                        console.log("Price list for ", price.name);
                        blockIps = true;
                        x.features.locked = false;
                        x.features.blockIps.locked = false;
                        await x.save();

                        user.wallet = await user.wallet - await price.price;
                        await user.save().then(() => {
                            console.log(price.price, "has been cut ");
                            total += price.price;
                        });
                    }
                    else {
                        console.log("Feature is either already unlocked or you don't have sufficient amount in your wallet");
                    }
            })
        };
        if (req.body.customReports == true) {
            let price;
            await Price.findById('5b9a231cc597034450c4c8e2', async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    price = doc;
                    // console.log("internal price: ",price);
                }
            });
            await Url.findById(id, async function (err, x) {
                if (err) {
                    console.log(err)
                } else
                    if (await x.features.customReports.locked == true && await user.wallet > await price.price) {
                        console.log("Price list for ", price.name);
                        customReports = true;
                        x.features.locked = false;
                        x.features.customReports.locked = false;
                        await x.save();

                        user.wallet = await user.wallet - await price.price;
                        await user.save().then(() => {
                            console.log(price.price, "has been cut ");
                            total += price.price;
                        });
                    }
                    else {
                        console.log("Feature is either already unlocked or you don't have sufficient amount in your wallet");
                    }
            })
        };
        if (req.body.fourOfour == true) {
            let price;
            await Price.findById('5b9a2323c597034450c4c8e3', async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    price = doc;
                    // console.log("internal price: ",price);
                }
            });
            await Url.findById(id, async function (err, x) {
                if (err) {
                    console.log(err);
                } else
                    if (await x.features.fourOfour.locked == true && await user.wallet > await price.price) {
                        console.log("Price list for ", price.name);
                        fourOfour = true;
                        x.features.locked = false;
                        x.features.fourOfour.locked = false;
                        await x.save();

                        user.wallet = await user.wallet - await price.price;
                        await user.save().then(() => {
                            console.log(price.price, "has been cut ");
                            total += price.price;
                        });
                    }
                    else {
                        console.log("Feature is either already unlocked or you don't have sufficient amount in your wallet");
                    }
            })
        };
        if (req.body.customShortUrl == true) {
            let price;
            await Price.findById('5b9a238ec597034450c4c8e4', async function (err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    price = doc;
                    // console.log("internal price: ",price);
                }
            });
            await Url.findById(id, async function (err, x) {
                if (err) {
                    console.log(err)
                } else
                    if (await x.features.customShortUrl.locked == true && await user.wallet > await price.price) {
                        console.log("Price list for ", price.name);
                        customShortUrl = true;
                        x.features.locked = false;
                        x.features.customShortUrl.locked = false;
                        await x.save();

                        user.wallet = await user.wallet - await price.price;
                        await user.save().then(() => {
                            console.log(price.price, "has been cut ");
                            total += price.price;
                        });
                    }
                    else {
                        console.log("Feature is either already unlocked or you don't have sufficient amount in your wallet");
                    }
            })
        };

        return {
            "totalAmountCut": await total,
            "customExpiryDate": await customExpiryDate,
            "urlRedirectto": await urlRedirectto,
            "enableToggle": await enableToggle,
            "blockIps": await blockIps,
            "customReports": await customReports,
            "fourOfour": await fourOfour,
            "customShortUrl": await customShortUrl
        }
    } catch (error) {
        console.log(error)
        return error
    }
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
