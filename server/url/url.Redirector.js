const db = require('../../config/db');
const Url = db.Url;

module.exports = {
    update,
};

async function update(id, param) {
    console.log('touched redirector')
    if (await Url.findOne({ queryKey: id })) {
        let url = await Url.findOneAndUpdate({ queryKey: id },
            {
                $push: {
                    analytics:
                    {
                        // browser: param.analytics.browser,
                        // language: param.analytics.language,
                        // refferer: param.analytics.refferer,
                        // country: param.analytics.country,
                        Region: "Southeast Asia"
                    },

                }
            }
            );

        return await url.actualUrl
    }
}