const db = require('../../_helper/db');
const Url = db.Url;
var shortid = require('shortid');
module.exports = {
    getAll,
    getById,
    create,
    update,
    // delete: _delete
};

async function create(UrlParam) {
    
    const url = new Url({

        actualUrl: UrlParam.actualUrl,
        shortUrl: `http://localhost:4040/${shortid.generate()}`,
        user: UrlParam.user
        
    });

    // save feedback
    await url.save();
}

async function getAll() {
    return await Url.find()
    // .sort('-createdAt');
}

async function getById(id) {
    return await Url.findById(id);
}

async function update(id, UrlParam) {
    const url = await Url.findById(id);

    // copy priceParam properties to price
    Object.assign(url, UrlParam);

    await url.save();
}
