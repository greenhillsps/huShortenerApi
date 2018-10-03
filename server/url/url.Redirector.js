const db = require('../../config/db');
const Url = db.Url;
const useragent = require('useragent');
const ipstack = require('ipstack')



function update(id, req) {
    return new Promise((resolve, reject) => {
        try {
            // Url.findOne({ queryKey: id }).lean().exec(function (err, url) {
            //     let stop = false;
            //     console.log(url.features.blockIps.ips.length)
            //     for (let i = 0; i < url.features.blockIps.ips.length; i++) {
            //         if (url.features.blockIps.ips[i] === req.clientIp) {
            //             stop = true;
            //         }
            //     }
            // })
            ipstack(req.clientIp, "555ffad38e5faadd4df7aaa9b9db8141", (err, response) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                // else if (url.features.customShortUrl.locked === true && url.features.locked === true) {

                // }
                // else if (url.features.fourOfour.locked === true && url.features.locked === true) {

                // }
                // else if (url.features.customReports.locked === true && url.features.locked === true) {

                // }
                // else if (url.features.blockIps.locked === true && url.features.locked === true) {

                // }
                // else if (url.features.enableToggle.locked === true && url.features.locked === true) {

                // }
                // else if (url.features.urlRedirectto.locked === true && url.features.locked === true) {

                // }
                // else if (url.features.customExpiryDate.locked === true && url.features.locked === true) {

                // }
                else
                    // if (url.features.locked === true) 
                    if (response) {
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
                                    console.log(err);
                                    reject(err)
                                } else if (!response) {
                                    resolve("errorrrr, actual url not found")
                                } else if (response.actualUrl) {
                                    console.log("this is the response url: ", response.actualUrl);
                                    resolve(response.actualUrl)
                                } else {
                                    resolve("errorrrr, actual url not found")
                                }
                            })
                    } else {
                        resolve("errorrrr, actual url not found")
                    }
            })
        } catch (err) {
            console.log(err);
            reject(err);
        };
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