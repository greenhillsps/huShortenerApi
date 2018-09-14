const db = require('../../config/db');
const Url = db.Url;

module.exports = {
    update,
};

async function update(id, req) {
    console.log('touched redirector')
    if (await Url.findOne({ queryKey: id })) {
        let url = await Url.findOneAndUpdate({ queryKey: id },
            {
                $push: {
                    analytics:
                    {
                        // browser: param.analytics.browser,
                        // language: param.analytics.language,
                        refferer: req.header('Referer'),
                        device: req.device.type,
                        // country: param.analytics.country,
                        ip: req.clientIp,
                        Region: "Southeast Asia"
                    },

                }
            }
            );

        return await url.actualUrl
    }
}