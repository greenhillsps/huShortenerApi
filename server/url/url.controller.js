const db = require('../../config/db');
const User = require('../user/user.model');
const Url = db.Url;
var shortid = require('shortid');
module.exports = {
    getAll,
    getByUserId,
    create,
    update,
    // delete: _delete
};

async function create(UrlParam) {

    let existing = await Url.findOne({ actualUrl: UrlParam.actualUrl });
    let id;
    let url
    if (UrlParam.user) {

        id = shortid.generate();
        url = await new Url({
            actualUrl: UrlParam.actualUrl,
            shortUrl: `http://localhost:4040/${id}`,
            user: UrlParam.user,
            queryKey: id,
        });
        // save url
        await url.save();

    } else if (existing) {
        url = {
            shortUrl: null
        }
        id = await existing.queryKey;
        url.shortUrl = existing.shortUrl
    } else {

        id = shortid.generate();
        url = await new Url({
            actualUrl: UrlParam.actualUrl,
            shortUrl: `http://localhost:4040/${id}`,
            user: UrlParam.user,
            queryKey: id,
        });
        // save url
        await url.save();
    }





    return url
}

async function getAll(req) {
    const {  skip , limit} = req.query;
    return await Url.find(null,null,{ skip: (parseInt(skip)), limit:(parseInt(limit)) })
    //  .sort('-createdAt');
}

async function getByUserId(id) {

    if (await User.findById(id.params.id)) {
        const {  skip , limit} = id.query;
        urls = await Url.find({ user: id.params.id }, null,{ skip: (parseInt(skip)), limit:(parseInt(limit)) } );
        return await urls
    }
    else {
        return await null
    }

}

async function update(id, UrlParam) {
    const url = await Url.findById(id);

    // copy UrlParam properties to Url
    Object.assign(url, UrlParam);

    await url.save();
}
