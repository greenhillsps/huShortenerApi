const db = require('../../config/db');
const Url = db.Url;
const useragent = require('useragent');
const ipstack = require('ipstack')
const extractDomain = require('extract-domain');
const request = require('request');
const moment = require('moment');
const validator = require('validator');
now = moment()

function customShortUrl(url) {
    //Yahan false pe masla khara hojata hae or error ana chaiye
    if (url.features.locked === false &&
        url.features.customShortUrl.locked === false &&
        moment(url.features.customShortUrl.expiryDate).isSameOrAfter(now) === false
        //  || validator.isURL(url.features.customShortUrl.shortUrl) === false
    ) {
        return false;
    } else {
        return true;
    }
}
function fourOfour(url) {
    //Yahan false pe masla khara hojata hae or error ana chaiye
    if (url.features.locked === false &&
        url.features.fourOfour.locked === false &&
        moment(url.features.fourOfour.expiryDate).isSameOrAfter(now) === false
        //  ||  validator.isURL(url.features.fourOfour.url) === false
    ) {
        return false;
    } else {
        return true;
    }
}
function blockIps(req, url) {
    //Yahan true pe masla khara hojata hae or error ana chaiye
    let checker;
    if (url.features.locked === false &&
        url.features.blockIps.locked === false &&
        moment(url.features.blockIps.expiryDate).isSameOrAfter(now) === false) {
        checker = true;
        console.log("Link Expired")
    } else {
        for (let i = 0; i < url.features.blockIps.ips.length; i++) {
            if (
                url.features.blockIps.ips[i] === req.clientIp
            ) {
                checker = true;
                console.log(" IP match ", url.features.blockIps.ips[i], "==", req.clientIp)
                break;
            } else {
                console.log("No error and the IP is: ", req.clientIp)
                checker = false;
            }
        }
    }
    console.log("This is Blockip checker function", checker)
    console.log("Blockip moment checker", moment(url.features.blockIps.expiryDate).isSameOrAfter(now))
    return checker
}
function enableToggle(url) {
    //Yahan true pe masla khara hojata hae or error ana chaiye
    if (
        url.features.locked === false &&
        url.features.enableToggle.locked === false &&
        moment(url.features.enableToggle.expiryDate).isSameOrAfter(now) === false) {
        return true;
    } else if (url.features.enableToggle.locked === false &&
        url.features.enableToggle.enable === false) {
        return true;
    }
    else {
        return false;
    }
}
function urlRedirectto(url) {
    if (url.features.locked === false &&
        url.features.urlRedirectto.locked === false &&
        moment(url.features.urlRedirectto.expiryDate).isSameOrAfter(now) === false
        // || validator.isURL(url.features.urlRedirectto.url) === false
    ) {
        return false;
    } else {
        return true;
    }
}
function customExpiryDate(url) {
    if (url.features.locked === false &&
        url.features.customExpiryDate.locked === false &&
        moment(url.features.customExpiryDate.expiryDate).isSameOrAfter(now) === false) {
        return true;
    } else if (url.features.locked === false &&
        url.features.customExpiryDate.locked === false &&
        moment(url.features.customExpiryDate.expiryDate).isSameOrAfter(now) === true &&
        moment(url.features.customExpiryDate.customExpiryDate).isSameOrAfter(now) === false) {
        return false;
    }
    else {
        return true;
    }
}

function update(id, req) {
    return new Promise((resolve, reject) => {
        try {
            Url.findOne({ queryKey: id }).lean().exec(function (err, url) {
                if (err) {
                    console.log("blockip checker ", err);
                    reject(err);
                } else if (url) {
                    console.log("blockip checker ", url);
                    if (url.features.locked === false &&
                        url.features.blockIps.locked === false &&
                        blockIps(req, url)) {
                        resolve("You Shall Not PASS!");
                    } else if (url.features.locked === false &&
                        url.features.enableToggle.locked === false &&
                        enableToggle(url)) {
                        resolve("This URL is deactivated by the owner!");
                    }
                    else {
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
                                console.log("IpStack response object", ipresponse);
                                console.log("IpStack lang response object", ipresponse.location.languages);
                                let obj = {
                                    browser: useragent.parse(req.headers['user-agent']).family ?
                                        useragent.parse(req.headers['user-agent']).family : "Unknown",
                                    language: ipresponse.location.languages ? ipresponse.location.languages[0].name : "Unknown",
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
                                            // if (response.features.locked === false &&
                                            //     response.features.customShortUrl.locked === false &&
                                            //     customShortUrl(url)) {
                                            //     console.log("this is the custom url: ", response.features.customShortUrl.shortUrl);
                                            //     request.get(response.features.customShortUrl.shortUrl, function (error, requestResponse, body) {
                                            //         if (error) {
                                            //             console.log("REQUEST error", error);
                                            //             reject(error);
                                            //         } else if (response.features.locked === false &&
                                            //             response.features.customExpiryDate.locked === false &&
                                            //             customExpiryDate(url) == false) {
                                            //             resolve("This URL is deactivated by the owner!");
                                            //         }
                                            //         else if (requestResponse.statusCode == 404 && fourOfour(url)) {
                                            //             console.log("REQUEST response", requestResponse.statusCode);
                                            //             resolve(response.features.fourOfour.url);
                                            //         } else {
                                            //             console.log("REQUEST response", requestResponse.statusCode);
                                            //             resolve(response.features.customShortUrl.shortUrl);
                                            //         }
                                            //     });
                                            // } else 
                                            if (response.features.locked === false &&
                                                response.features.fourOfour.locked === false &&
                                                fourOfour(url)) {
                                                request(response.actualUrl, function (error, requestResponse, body) {
                                                    if (error) {
                                                        console.log("REQUEST Error", error);
                                                        reject(error);
                                                    } else if (response.features.locked === false &&
                                                        response.features.customExpiryDate.locked === false &&
                                                        customExpiryDate(url) == false) {
                                                        resolve("This URL is deactivated by the owner!");
                                                    }
                                                    else if (requestResponse.statusCode == 404) {
                                                        resolve(response.features.fourOfour.url);
                                                    } else if (response.features.locked === false &&
                                                        response.features.urlRedirectto.locked === false &&
                                                        urlRedirectto(url)) {
                                                        resolve(response.features.urlRedirectto.url);
                                                    }
                                                    else {
                                                        resolve(response.actualUrl);
                                                    }
                                                });
                                            } else if (response.features.locked === false &&
                                                response.features.urlRedirectto.locked === false &&
                                                urlRedirectto(url)) {
                                                console.log("this is the urlRedirectto url: ", response.features.urlRedirectto.url);
                                                request.get(response.features.urlRedirectto.url, function (error, requestResponse, body) {
                                                    if (error) {
                                                        console.log("REQUEST error", error);
                                                        reject(error);
                                                    } else if (response.features.locked === false &&
                                                        response.features.customExpiryDate.locked === false &&
                                                        customExpiryDate(url) == false) {
                                                        resolve("This URL is deactivated by the owner!");
                                                    }
                                                    else if (requestResponse.statusCode == 404 && fourOfour(url)) {
                                                        console.log("REQUEST response", requestResponse.statusCode);
                                                        resolve(response.features.fourOfour.url);
                                                    } else {
                                                        console.log("REQUEST response", requestResponse.statusCode);
                                                        resolve(response.features.urlRedirectto.url);
                                                    }
                                                });
                                            }

                                            else {
                                                console.log("This is the actual url: ", response.actualUrl);
                                                if (response.features.locked === false &&
                                                    response.features.customExpiryDate.locked === false &&
                                                    customExpiryDate(url) == false) {
                                                    resolve("This URL is deactivated by the owner!");
                                                } else {
                                                    resolve(response.actualUrl);
                                                }
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
                    console.log("blockip checker ", url);
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