const db = require('../../_helper/db');
const Url = db.Url;

module.exports = {
    update,
};

async function update(id, param) {

    if (await Url.findOne({ queryKey: id })) {
        let url = await Url.findOneAndUpdate({ queryKey: id },
            {
                $push: {
                    analytics:
                    {
                        browser: param.analytics.browser,
                        language: param.analytics.language,
                        refferer: param.analytics.refferer,
                        country: param.analytics.country,
                        Region: param.analytics.Region
                    }
                }
            });

        return await url.actualUrl
    }
}