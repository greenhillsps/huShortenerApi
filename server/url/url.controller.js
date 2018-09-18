const db = require('../../config/db');
const User = require('../user/user.model');
const Url = db.Url;
const mongoose = require('mongoose');
var async = require("async");
const ObjectId = mongoose.Types.ObjectId;
var shortid = require('shortid');
module.exports = {
    getAll,
    getByUserId,
    create,
    update,
    getById
    // delete: _delete
};

async function create(req) {

    let existing = await Url.findOne({ actualUrl: req.body.actualUrl });
    let id;
    let url;
    console.log((req.userId))
    if (req.userId) {
        console.log("1st cond run", req.userId)
        id = shortid.generate();
        url = await new Url({
            actualUrl: req.body.actualUrl,
            shortUrl: `https://dotlyapidev.herokuapp.com/${id}`,
            user: req.userId,
            queryKey: id,
        });
        // save url
        await url.save();

    } else if (existing && req.userId == null) {
        console.log("2nd cond run", req.userId)
        url = {
            shortUrl: null
        }
        id = await existing.queryKey;
        url.shortUrl = existing.shortUrl
    } else {
        console.log("3rd cond run", req.userId)
        id = shortid.generate();
        url = await new Url({
            actualUrl: req.body.actualUrl,
            shortUrl: `http://localhost:4040/${id}`,
            user: !req.userId ? req.userId : null,
            queryKey: id,
        });
        // save url
        await url.save();
    }
    return url = { _id: url._id, actualUrl: url.actualUrl, shortUrl: url.shortUrl, user: url.user }
}

async function getAll(req) {
    console.log("coming from url controller getAll", req.userId)
    const { skip, limit } = req.query;
    let url = await Url.find(null, null, { skip: (parseInt(skip)), limit: (parseInt(limit)) })
    return url = { _id: url._id, actualUrl: url.actualUrl, shortUrl: url.shortUrl, user: url.user, date: url.createdAt }
    //  .sort('-createdAt');
}

async function getByUserId(req) {

    return new Promise((resolve, reject) => {
        try {
            console.log("coming from url controller getByUserId", req.userId)
            const { page, limit } = req.query;
            const perPage = (parseInt(limit));
            const currentPage = (parseInt(page)) || 1;
            Url.find({ user: req.userId }, { features: 0, analytics: 0, __v: 0 })
                .skip((perPage * currentPage) - perPage)
                .limit(perPage)
                .exec(function (err, urls) {
                    Url.count({ user: req.userId }).exec(function (err, count) {
                        console.log(count)
                        if (err) { reject("URL not found") }
                        else if (!urls) {
                            reject("errorrrr, URL not found")
                        }
                        else {
                            resolve({
                                URls: urls,
                                current: currentPage,
                                pages: Math.ceil(count / perPage),
                                totalCount: count
                            })
                        }
                    })
                });
        } catch (error) {
            return null
        }
    })
}
function getById(id) {


    return new Promise((resolve, reject) => {
        let f;
        let val;
        Url.findById({ _id: id }, {}).lean().exec(function (err, val) {
            f = val.analytics.length
            val = val;
            console.log(val.analytics.length);

            async.parallel([
                function (callback) {
                    Url.aggregate([
                        { $match: { _id: ObjectId(id) } },
                        { $unwind: "$analytics" },
                        { $group: { _id: "$analytics.Region", count: { $sum: 1 } } },
                        { $project: { count: 1, percentage: { "$multiply": [{ "$divide": [100, f] }, "$count"] } } },
                        { $sort: { _id: 1 } }
                    ]).exec(function (err, value) {
                        if (err) {
                            callback(err)
                        } else {
                            callback(null, value)
                        }
                    })
                },
                function (callback) {
                    Url
                        .aggregate([
                            { $match: { _id: ObjectId(id) } },
                            { $unwind: "$analytics" },
                            { $group: { _id: "$analytics.country", count: { $sum: 1 } } },
                            { $project: { count: 1, percentage: { "$multiply": [{ "$divide": [100, f] }, "$count"] } } },
                            { $sort: { _id: 1 } }
                        ]).exec(function (err, value) {
                            if (err) {
                                callback(err)
                            } else {
                                callback(null, value)
                            }
                        })
                },
                function (callback) {
                    Url
                        .aggregate([
                            { $match: { _id: ObjectId(id) } },
                            { $unwind: "$analytics" },
                            { $group: { _id: "$analytics.device", count: { $sum: 1 } } },
                            { $project: { count: 1, percentage: { "$multiply": [{ "$divide": [100, f] }, "$count"] } } },
                            { $sort: { _id: 1 } }
                        ]).exec(function (err, value) {
                            if (err) {
                                callback(err)
                            } else {
                                callback(null, value)
                            }
                        })
                },
                function (callback) {
                    Url
                        .aggregate([
                            { $match: { _id: ObjectId(id) } },
                            { $unwind: "$analytics" },
                            { $group: { _id: "$analytics.refferer", count: { $sum: 1 } } },
                            { $project: { count: 1, percentage: { "$multiply": [{ "$divide": [100, f] }, "$count"] } } },
                            { $sort: { _id: 1 } }
                        ]).exec(function (err, value) {
                            if (err) {
                                callback(err)
                            } else {
                                callback(null, value)
                            }
                        })
                },
                function (callback) {
                    Url
                        .aggregate([
                            { $match: { _id: ObjectId(id) } },
                            { $unwind: "$analytics" },
                            { $group: { _id: "$analytics.language", count: { $sum: 1 } } },
                            { $project: { count: 1, percentage: { "$multiply": [{ "$divide": [100, f] }, "$count"] } } },
                            { $sort: { _id: 1 } }
                        ]).exec(function (err, value) {
                            if (err) {
                                callback(err)
                            } else {
                                callback(null, value)
                            }
                        })
                },
                function (callback) {
                    Url
                        .aggregate([
                            { $match: { _id: ObjectId(id) } },
                            { $unwind: "$analytics" },
                            { $group: { _id: "$analytics.browser", count: { $sum: 1 } } },
                            { $project: { count: 1, percentage: { "$multiply": [{ "$divide": [100, f] }, "$count"] } } },
                            { $sort: { _id: 1 } }
                        ]).exec(function (err, value) {
                            if (err) {
                                callback(err)
                            } else {
                                callback(null, value)
                            }
                        })
                }
            ], function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    resolve({
                        TotalClicks: f,
                        URL: val,
                        Region: result[0],
                        country: result[1],
                        Device: result[2],
                        Refferer: result[3],
                        Language: result[4],
                        Browser: result[5],

                    })

                }
            });

        })
    });
}
async function update(id, UrlParam) {
    const url = await Url.findById(id);

    // copy UrlParam properties to Url
    Object.assign(url, UrlParam);

    await url.save();
}


// pagination tutorial = https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html

