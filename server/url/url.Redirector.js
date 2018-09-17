const db = require('../../config/db');
const Url = db.Url;
const useragent = require('useragent');
const ipstack = require('ipstack')



function update(id, req) {
    return new Promise((resolve, reject) => {
        try {

            ipstack("103.209.52.44", "555ffad38e5faadd4df7aaa9b9db8141", (err, response) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    let obj = {
                        browser: useragent.parse(req.headers['user-agent']).family ?
                            useragent.parse(req.headers['user-agent']).family : "Unknown",
                        language: req.language ? req.language : "English",
                        refferer: req.header('Referer') ?
                            req.header('Referer') : "No Referrer",
                        device: req.device.type ? req.device.type : "Unknown",
                        country: response.country_name ? response.country_name : "Unknown",
                        ip: req.clientIp ? req.clientIp : "Unknown",
                        Region: response.region_name ? response.region_name : "Unknown"
                    }
                    Url.findOneAndUpdate({ queryKey: id }, {
                        $push: {
                            analytics: obj
                        }
                    },
                        { new: true },
                        function (err, response) {
                            if (err) {
                                console.log(err)
                                reject(err)
                            } else if (!response) {
                                reject("errorrrr, actual url not found")
                            } else if (response.actualUrl) {
                                console.log("this is the response url: ", response.actualUrl);
                                resolve(response.actualUrl)
                            } else {
                                reject(err)
                            }
                        });
                }
            })
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}

module.exports = {
    update,
};

// Url.findOneAndUpdate({ queryKey: id },  {
//     $push: {
//         analytics: obj
//     }
// },
// { new: true },
// function (err, response) {
//     if (err) {
//         console.log(err)
//         return null
//     } else {
//         console.log("this is the response url: ", response.actualUrl);
//     }
//     return response.actualUrl
// });