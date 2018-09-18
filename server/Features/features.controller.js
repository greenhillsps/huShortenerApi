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

async function update(id, Param) {
    const feature = await Url.findById(id);

    // copy UrlParam properties to Url
    Object.assign(feature, Param);

    await feature.save();
}