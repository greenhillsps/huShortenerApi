const db = require('../../config/db');
const User = require('../user/user.model');
const Url = db.Url;
const mongoose = require('mongoose');
var async = require("async");
const ObjectId = mongoose.Types.ObjectId;
//const shortid = require('shortid');
const uid=require('uid');
const { append } = require('../helpers/helper');
const moment = require('moment');
const extract = require('meta-extractor');
const config = require('../../config/config');
const extractDomain = require('extract-domain');

module.exports = {
    search,
    getByUserId,
    create, 
    update,
    getById
};
function create(req) {
    
 req.body.actualUrl = append(req.body.actualUrl);
    return new Promise((resolve, reject) => {
        Url.findOne({ actualUrl: req.body.actualUrl }, function (err, existing) {
            if (err) {
                reject(err);
            } else {
                let id;
                let url;
                let title;
                let description;
                extract({ uri: req.body.actualUrl }, (err, res) => {
                    if (err) {
                        if (req.userId) {
                            id =uid()// shortid.generate();
                            url = new Url({
                                actualUrl: req.body.actualUrl,
                                shortUrl: `${config.shortUrl + id}`,
                                user: req.userId,
                                queryKey: id,
                                title: extractDomain(req.body.actualUrl),
                                description: extractDomain(req.body.actualUrl)

                            });
                            // save url
                            url.save();
                            User.findByIdAndUpdate(req.userId, { $inc: { totalURLS: 1 } }).exec();

                        } else if (existing && req.userId == null) {
                            url = {
                                shortUrl: null
                            }
                            id = existing.queryKey;
                            url.shortUrl = existing.shortUrl

                        } else {
                            id =uid()// shortid.generate();
                            url = new Url({
                                actualUrl: req.body.actualUrl,
                                shortUrl: `${config.shortUrl + id}`,
                                user: !req.userId ? req.userId : null,
                                queryKey: id,
                                title: "No title found",
                                description: "No description found"
                            });
                            url.save();
                        }
                        resolve(url = { _id: url._id, actualUrl: url.actualUrl, shortUrl: url.shortUrl, user: url.user })
                    } else {
                        if (req.userId) {
                            id = uid()//shortid.generate();
                            url = new Url({
                                actualUrl: req.body.actualUrl,
                                shortUrl: `${config.shortUrl + id}`,
                                user: req.userId,
                                queryKey: id,
                                title: res.title ? res.title : "No title found",
                                description: res.description ? res.description : "No description found"

                            });
                            // save url
                            url.save();
                            User.findByIdAndUpdate(req.userId, { $inc: { totalURLS: 1 } }).exec();

                        } else if (existing && req.userId == null) {
                            url = {
                                shortUrl: null
                            }
                            id = existing.queryKey;
                            url.shortUrl = existing.shortUrl

                        } else {
                            id = uid()//shortid.generate();
                            url = new Url({
                                actualUrl: req.body.actualUrl,
                                shortUrl: `${config.shortUrl + id}`,
                                user: !req.userId ? req.userId : null,
                                queryKey: id,
                                title: res.title ? res.title : "No title found",
                                description: res.description ? res.description : "No description found"
                            });
                            url.save();
                        }
                        resolve(url = { _id: url._id, actualUrl: url.actualUrl, shortUrl: url.shortUrl, user: url.user })
                    }
                });
            }
        });

    })
}

async function search(req) {
    Url.findOne({ actualUrl: req.query.a, isActive: true }, function (err, arr) {
        if (err) {
            console.log("Errrrrror", err);
            return err
        } else if (arr.length > 0) {
            return arr
        } else {
            Url.find({ shortUrl: req.query.a, isActive: true }, function (err, arr) {
                if (err) {
                    console.log("Errrrrror 2", err);
                    return err
                } else if (arr) {
                    return arr
                } else {
                    return "No results found"
                }
            });
        }
    });
}

async function getByUserId(req) {

    return new Promise((resolve, reject) => {
        try {
            const { page, limit } = req.query;
            const perPage = (parseInt(limit));
            const currentPage = (parseInt(page)) || 1;
            Url.find({ user: req.userId, isActive: true }, { features: 0, analytics: 0, __v: 0 })
                .sort('-_id')
                .skip((perPage * currentPage) - perPage)
                .limit(perPage)
                .exec(function (err, urls) {
                    if (err) {
                        reject(err);
                    } else {
                        Url.count({ user: req.userId, isActive: true }).exec(function (err, count) {
                            if (err) {
                                reject(err)
                            }
                            else if (urls == null || urls == undefined) {
                                resolve("Error, URL not found")
                            }
                            else {
                                resolve({
                                    URls: urls,
                                    current: currentPage,
                                    pages: Math.ceil(count / perPage),
                                    totalCount: count
                                });
                            }
                        });
                    }
                });
        } catch (error) {
            reject(error)
        }
    })
}
function getById(id) {


    return new Promise((resolve, reject) => {
        let f;
        let val;
        Url.findOne({ _id: id, isActive: true }, {}).lean().exec(function (err, val) {
            if (err) {
                reject(err);
            } else if (val == null || val == undefined) {
                resolve("Url not found");
            } else if (val && val.analytics.length > 0) {
                f = val.analytics.length
                val = val;
                async.parallel([
                    function (callback) {
                        Url.aggregate([
                            { $match: { _id: ObjectId(id) } },
                            { $unwind: "$analytics" },
                            { $group: { _id: "$analytics.Region", count: { $sum: 1 } } },
                            { $project: { count: 1, percentage: { "$multiply": [{ "$divide": [100, f] }, "$count"] } } },
                            { $sort: { count: -1 } }
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
                                { $sort: { count: -1 } }
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
                                { $sort: { count: -1 } }
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
                                { $sort: { count: -1 } }
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
                                { $sort: { count: -1 } }
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
                                { $sort: { count: -1 } }
                            ]).exec(function (err, value) {
                                if (err) {
                                    callback(err)
                                } else {
                                    callback(null, value)
                                }
                            })
                    },
                    function (callback) {

                        let map = val.analytics.map(x => {
                            let arr = {}
                            let res;

                            res = val.analytics.filter(y => moment(x.clickDate).isSame(y.clickDate, 'month'));
                            let date = moment(res.clickDate).format('MMMM YYYY');
                            let count = res.length;
                            arr = {
                                month: date,
                                count: count
                            }
                            return arr;

                        })
                        var result = map.reduce((unique, o) => {
                            if (!unique.some(obj => obj.month === o.month)) {
                                unique.push(o);
                            }
                            return unique;
                        }, []);
                        callback(null, result);
                    }
                ], function (err, result) {
                    if (err) {
                        reject(err)
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
                            VisitGraph: result[6]
                        })
                    }
                });
            }
            else {
                resolve({
                    TotalClicks: 0,
                    URL: val,
                    Region: null,
                    country: null,
                    Device: null,
                    Refferer: null,
                    Language: null,
                    Browser: null,
                    map: null,
                    VisitGraph: null
                })
            };
        });
    });
};
function update(id) {
    return new Promise((resolve, reject) => {
        Url.findOneAndUpdate({ _id: id, "isActive": true }, { $set: { isActive: false } }, { new: true }, function (err, doc) {
            if (err) {
                reject(err)
            } else {
                resolve(doc)
            }
        })
    });
}


// pagination tutorial = https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html
