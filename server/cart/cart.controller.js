const mongoose = require('mongoose');
const db = require('../../config/db');
const Url = db.Url;
const User = require('../user/user.model');
var async = require("async");
const ObjectId = mongoose.Types.ObjectId;
var shortid = require('shortid');
module.exports = {
    update,
};

async function update(id, req) {
    const user = await User.findById(req.userId);
    console.log(id)
    let customExpiryDate = false;
    let urlRedirectto = false;
    let enableToggle = false;
    let blockIps = false;
    let customReports = false;
    let fourOfour = false;
    let customShortUrl = false;

    if (req.body.customExpiryDate == true) {
        console.log("customExpiryDate");
        customExpiryDate = true;
        Url.findByIdAndUpdate(id, {
            $set: { "features.locked": false },
            $set: { "features.customExpiryDate.locked": false },
        },
            { new: true }
        ).lean().exec(function (err, lala) {
            if (err) {
                console.log(err)
            } else {
                console.log("hogya")
            }
        })
    }
    if (req.body.urlRedirectto == true) {
        console.log("urlRedirectto");
        urlRedirectto = true;
        Url.findByIdAndUpdate({ _id: id }, {
            '$set': { "features.locked": false },
            // '$set': { "features.urlRedirectto.locked": false },
        }, { new: true }).lean().exec(function (err, lala) {
            if (err) {
                console.log(err)
            } else {
                console.log("hogya")
            }
        })
    };
    if (req.body.enableToggle == true) {
        console.log("enableToggle");
        enableToggle = true;
        Url.update({ _id: id }, {
            // '$set': { "features.locked": false },
            '$set': { "features.enableToggle.locked": false },
        }, { new: true }).lean().exec(function (err, lala) {
            if (err) {
                console.log(err)
            } else {
                console.log("hogya")
            }
        })
    };
    if (req.body.blockIps == true) {
        console.log("blockIps");
        blockIps = true;
        Url.update({ _id: id }, {
            // '$set': { "features.locked": false },
            '$set': { "features.blockIps.locked": false },
        }, { new: true }).lean().exec(function (err, lala) {
            if (err) {
                console.log(err)
            } else {
                console.log("hogya")
            }
        })
    };
    if (req.body.customReports == true) {
        console.log("customReports");
        customReports = true;
        Url.update({ _id: id }, {
            // '$set': { "features.locked": false },
            '$set': { "features.customReports.locked": false },
        }, { new: true }).lean().exec(function (err, lala) {
            if (err) {
                console.log(err)
            } else {
                console.log("hogya")
            }
        })
    };
    if (req.body.fourOfour == true) {
        console.log("fourOfour");
        fourOfour = true;
        Url.update({ _id: id }, {
            // '$set': { "features.locked": false },
            '$set': { "features.fourOfour.locked": false },
        }, { new: true }).lean().exec(function (err, lala) {
            if (err) {
                console.log(err)
            } else {
                console.log("hogya")
            }
        })
    };
    if (req.body.customShortUrl == true) {
        console.log("customShortUrl");
        customShortUrl = true;
        Url.update({ _id: id }, {
            // '$set': { "features.locked": false },
            '$set': { "features.customShortUrl.locked": false },
        }, { new: true }).lean().exec(function (err, lala) {
            if (err) {
                console.log(err)
            } else {
                console.log("hogya")
            }
        })
    };


    // const url = await Url.findById(id, {});

    // let consta;
    // if (url.features.locked == true) {
    //     consta = true;
    // } else {
    //     consta = false;
    // 

    // copy UrlParam properties to Url
    // Object.assign(feature, Param);

    // await feature.save();

    return {
        "customExpiryDate": customExpiryDate,
        "urlRedirectto": urlRedirectto,
        "enableToggle": enableToggle,
        "blockIps": blockIps,
        "customReports": customReports,
        "fourOfour": fourOfour,
        "customShortUrl": customShortUrl
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