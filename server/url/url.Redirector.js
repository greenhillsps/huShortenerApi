const db = require('../../_helper/db');
const Url = db.Url;

module.exports = {
    getById,
};

async function getById(id) {

    if (await Url.findOne({ query: id })) {
        let url = await Url.findOneAndUpdate({ queryKey: id }, {$push : {analytics: { browser: 'Chrome',language:'English', refferer: 'Facebook', country: 'Pakistan', Region: "SouthEast-Asia" }}});
  
        return await url.actualUrl
    }
}