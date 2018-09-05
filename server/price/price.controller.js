const db = require('../../_helper/db');
const Price = db.Price;

module.exports = {
    getAll,
    getById,
    create,
    update,
    // delete: _delete
};

async function create(PriceParam) {

    const price = new Price({
        'customExpiryDate': PriceParam.customExpiryDate,
        'urlRedirectto': PriceParam.urlRedirectto,
        'enableToggle': PriceParam.enableToggle,
        'blockIps': PriceParam.blockIps,
        'customReports': PriceParam.customReports,
        '404Management' : PriceParam.fourOfour,
        'customShortUrl' : PriceParam.customShortUrl,
    });

    // save feedback
    await price.save();
}

async function getAll() {
    return await Price.find()
    // .sort('-createdAt');
}

async function getById(id) {
    return await Price.findById(id);
}

async function update(id, PriceParam) {
    const price = await Price.findById(id);

    // copy priceParam properties to price
    Object.assign(price, PriceParam);

    await price.save();
}