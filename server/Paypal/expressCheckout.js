
var express = require('express');
const router = express.Router();
var paypal = require('paypal-rest-sdk');
const User = require('../user/user.model');
const config = require('../../config/config');

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': config.clientId, // client id
    'client_secret': config.clientSecret // client secret 
});

let currentUser = null;
let amount = null;
// payment process 
router.use('/buy', (req, res) => {
    var profile_name = Math.random().toString(36).substring(7);
    const { a } = req.query
    finduser(req)
    async function finduser(req) {

        console.log(req.userId);
        User.findById(req.userId, function (err, user) {
            if (err) {
                console.log(err)
            } else if (user) {
                console.log(user.firstName, a)
                currentUser = user;
                amount = a;
                console.log(currentUser)

                var create_web_profile_json = {
                    "name": profile_name,
                    "presentation": {
                        "brand_name": "Dotly",
                        "logo_image": "https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg",
                        "locale_code": "US"
                    },
                    "input_fields": {
                        "allow_note": true,
                        "no_shipping": 1,
                        "address_override": 1
                    },
                };
                // payment object 
                var payment = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "https://dotlyapidev.herokuapp.com/api/paypal/success",
                        "cancel_url": "https://dotlyapidev.herokuapp.com/api/paypal/err"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": user.firstName,
                                "sku": 'Transferring amount to your wallet',
                                "price": a,
                                "currency": "USD",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "total": a,
                            "currency": "USD"
                        },
                        "description": "Transferring amount to Dotly"
                    }]
                }
                //experience    
                paypal.webProfile.create(create_web_profile_json, function (error, web_profile) {
                    if (error) {
                        console.log("This is the webProfile Error: ", error)
                        // res.send(422).json("paypal not working")
                        // return null
                        res.sendStatus(408);
                    } else {
                        //Set the id of the created payment experience in payment json
                        var experience_profile_id = web_profile.id;
                        payment.experience_profile_id = experience_profile_id;
                        // calling the create Pay method 
                        createPay(payment)
                            .then((transaction) => {
                                var id = transaction.id;
                                var links = transaction.links;
                                var counter = links.length;
                                user.paymentId.push(id)

                                while (counter--) {
                                    if (links[counter].method == 'REDIRECT') {
                                        console.log("PaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaY", links[counter].href, "AAANNNNDDDDD this is the IDEEEE", id)
                                        // redirecting to paypal where user approves the transaction 
                                        return res.send(links[counter].href)
                                    }
                                }
                                // console.log("saasasasasasasasasasasasasasassasasasasasasasasasasasasas",id);
                            })
                            .catch((err) => {
                                console.log(err);
                                res.send('https://socialmediaweek.org/blog/2016/01/most-embarrasing-social-media-fails-2015/');
                            });
                    }
                });
            } else {
                res.send("Invalid user credential, please log in again")
            }
        })
    }
});

// success page 
router.use('/success', (req, res) => {
    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };
    console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr total amount paid: ", payment.transactions[0].amount.total)

    // calling the final payment execute method
    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        if (error) {
            console.error(error);
        } else {
            if (payment.state === 'approved') {
                res.redirect('https://soundcloud.com/');
                User.update({ paymentId: paymentId }, {
                    $inc: {
                        'wallet': payment.transactions[0].amount.total
                    },
                    $push: {
                        transactionHistory: payment
                    }
                }, { new: true }, function (err, newuser) {
                    if (err) {
                        console.log("User could not be updated in payment execution")
                    } else {
                        console.log("This is the current wallet of  user: ", newuser.wallet);
                        console.log("This is the payment status: ", payment);
                    }
                })
            } else {
                res.redirect('https://soundcloud.com/');
            }
        }
    });
})

// error page 
router.use('/err', (req, res) => {
    console.log(req.query);
    // res.redirect('https://soundcloud.com/');
    res.redirect('https://socialmediaweek.org/blog/2016/01/most-embarrasing-social-media-fails-2015/');
})

// helper functions 
var createPay = (payment) => {
    return new Promise((resolve, reject) => {
        paypal.payment.create(payment, function (err, payment) {
            if (err) {
                reject(err);
            }
            else {
                resolve(payment);
                console.log(payment)
            }
        });
    });
}

module.exports = router;


// Tutorial link: https://www.nodejsera.com/paypal-payment-integration-using-nodejs-part2.html
// Create user experience profile : https://github.com/paypal/PayPal-node-SDK/blob/master/samples/payment_experience/web_profile/create_payment_with_customized_experience.js#L25
// paypal tutorial https://developer.paypal.com/docs/checkout/how-to/server-integration/#1-set-up-your-client-to-call-your-server