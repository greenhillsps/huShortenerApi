const db = require('../../config/db');
const Url = db.Url;
const useragent = require('useragent');
const ipstack = require('ipstack')
const extractDomain = require('extract-domain');
var request = require('request');



function update(id, req) {
    return new Promise((resolve, reject) => {
        try {
            Url.findOne({ queryKey: id }).lean().exec(function (err, url) {
                if (err) {
                    console.log("blockip checker ", err)
                    reject(err);
                } else if (url) {
                    console.log("blockip checker ", url)
                    if (url.features.locked === false && url.features.blockIps.locked === false) {
                        let stop = false;
                        for (let i = 0; i < url.features.blockIps.ips.length; i++) {
                            if (url.features.blockIps.ips[i] === req.clientIp) {
                                stop = true;
                                resolve("You Shall Not PASS!");
                            }
                        }
                    } else {
                        ipstack(req.clientIp, "555ffad38e5faadd4df7aaa9b9db8141", (err, ipresponse) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else if (ipresponse) {
                                    let ref;
                                    if (req.header('Referer')) {
                                        ref = extractDomain(req.header('Referer'));
                                    } else {
                                        ref = null;
                                    }
                                    let obj = {
                                        browser: useragent.parse(req.headers['user-agent']).family ?
                                            useragent.parse(req.headers['user-agent']).family : "Unknown",
                                        language: req.language ? req.language : "English",
                                        refferer: ref ? ref : "No Referrer",
                                        device: req.device.type ? req.device.type : "Unknown",
                                        country: ipresponse.country_name ? ipresponse.country_name : "Unknown",
                                        ip: req.clientIp ? req.clientIp : "Unknown",
                                        Region: ipresponse.continent_name ? ipresponse.continent_name : "Unknown"
                                    }
                                    Url.findOneAndUpdate({ queryKey: id }, {
                                        $push: {
                                            analytics: obj
                                        }
                                    },
                                        { new: true },
                                        function (err, response) {
                                            if (err) {
                                                console.log("Update query reject", err);
                                                reject(err)
                                            } else if (!response) {
                                                resolve("Error, URL not found");
                                            } else if (response) {
                                                if (response.features.locked === false && response.features.customShortUrl.locked === false) {
                                                    console.log("this is the custom url: ", response.features.customShortUrl.shortUrl);
                                                    resolve(response.features.customShortUrl.shortUrl);
                                                } else if (response.features.locked === false && response.features.fourOfour.locked === false && response.features.fourOfour.url) {
                                                    request('http://www.google.com', function (error, requestResponse, body) {
                                                        if (error) {
                                                            console.log("REQUEST error", err);
                                                            reject(err);
                                                        }
                                                        else if (requestResponse.statusCode !== 404) {
                                                            if (response.features.fourOfour.url && response.features.fourOfour.url !== null) {
                                                                resolve(response.features.fourOfour.url);
                                                            } else {
                                                                resolve(response.features.fourOfour.url);
                                                            }
                                                        } else {
                                                            resolve(response.features.fourOfour.url);
                                                        }
                                                    });
                                                } else {
                                                    console.log("this is the actual url: ", response.actualUrl);
                                                    resolve(response.actualUrl);
                                                }
                                            } else {
                                                resolve("Error, URL not found");
                                            }
                                        })
                                } else {
                                    resolve("Error, URL not found");
                                }
                        })
                    }
                } else {
                    console.log("blockip checker ", url)
                    resolve("Error, URL not found");
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