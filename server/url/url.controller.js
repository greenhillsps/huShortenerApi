const db = require('../../_helper/db');
const Url = db.Url;

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
        shortUrl: "DemoShortString",
        user: UrlParam.user
        // features: {
        //     'customExpiryDate': {
        //         puchaseDate: UrlParam.features.customExpiryDate.puchaseDate,
        //         currentPrice: UrlParam.features.customExpiryDate.currentPrice,
        //         boughtPrice: UrlParam.features.customExpiryDate.boughtPrice,
        //         expiryDate: UrlParam.features.customExpiryDate.expiryDate
        //     },
        //     'urlRedirectto': {
        //         puchaseDate: UrlParam.features.urlRedirectto.puchaseDate,
        //         currentPrice: UrlParam.features.urlRedirectto.currentPrice,
        //         boughtPrice: UrlParam.features.urlRedirectto.boughtPrice,
        //         expiryDate: UrlParam.features.urlRedirectto.expiryDate
        //     },
        //     'enableToggle': {
        //         puchaseDate: UrlParam.features.enableToggle.puchaseDate,
        //         currentPrice: UrlParam.features.enableToggle.currentPrice,
        //         boughtPrice: UrlParam.features.enableToggle.boughtPrice,
        //         expiryDate: UrlParam.features.enableToggle.expiryDate
        //     },
        //     'blockIps': {
        //         puchaseDate: UrlParam.features.blockIps.puchaseDate,
        //         currentPrice: UrlParam.features.blockIps.currentPrice,
        //         boughtPrice: UrlParam.features.blockIps.boughtPrice,
        //         expiryDate: UrlParam.features.blockIps.expiryDate
        //     },
        //     'customReports': {
        //         puchaseDate: UrlParam.features.customReports.puchaseDate,
        //         currentPrice: UrlParam.features.customReports.currentPrice,
        //         boughtPrice: UrlParam.features.customReports.boughtPrice,
        //         expiryDate: UrlParam.features.customReports.expiryDate
        //     },
        //     'fourOfour': {
        //         puchaseDate: UrlParam.features.fourOfour.puchaseDate,
        //         currentPrice: UrlParam.features.fourOfour.currentPrice,
        //         boughtPrice: UrlParam.features.fourOfour.boughtPrice,
        //         expiryDate: UrlParam.features.fourOfour.expiryDate
        //     },
        //     'customShortUrl': {
        //         puchaseDate: UrlParam.features.customShortUrl.puchaseDate,
        //         currentPrice: UrlParam.features.customShortUrl.currentPrice,
        //         boughtPrice: UrlParam.features.customShortUrl.boughtPrice,
        //         expiryDate: UrlParam.features.customShortUrl.expiryDate
        //     },
        // },
    });

    // console.log(url)
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
