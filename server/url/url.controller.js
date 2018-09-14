const db = require('../../config/db');
const User = require('../user/user.model');
const Url = db.Url;
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
            shortUrl: `http://localhost:4040/${id}`,
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
    console.log("comin fro url controller getAll", req.userId)
    const { skip, limit } = req.query;
    let url = await Url.find(null, null, { skip: (parseInt(skip)), limit: (parseInt(limit)) })
    return url = { _id: url._id, actualUrl: url.actualUrl, shortUrl: url.shortUrl, user: url.user }
    //  .sort('-createdAt');
}

async function getByUserId(req) {

    if (await User.findById(req.userId)) {
        console.log("comin fro url controller getByUserId", req.userId)
        const { skip, limit } = req.query;
        urls = await Url.find({ user: req.userId }, { features: 0, analytics: 0, createdAt: 0, __v: 0 }, { skip: (parseInt(skip)), limit: (parseInt(limit)) });
        return urls
    }
    else {
        return await null
    }
}
async function getById(id) {
    return await Url.findById(id);

}
async function update(id, UrlParam) {
    const url = await Url.findById(id);

    // copy UrlParam properties to Url
    Object.assign(url, UrlParam);

    await url.save();
}
