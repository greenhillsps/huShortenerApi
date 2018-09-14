
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
var profile_name = Math.random().toString(36).substring(7);
let currentUser = null;
let amount = null;
// payment process 
router.use('/buy', (req, res) => {

    const { a } = req.query
    finduser(req)
    async function finduser(req) {

        console.log(req.userId);
        User.findById(req.userId, function (err, user) {
            if (err) {
                console.log(err)
            } else {
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
                        "return_url": "http://localhost:4040/api/paypal/success",
                        "cancel_url": "http://localhost:4040/api/paypal/err"
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
                        throw error;
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
                                while (counter--) {
                                    if (links[counter].method == 'REDIRECT') {
                                        // redirecting to paypal where user approves the transaction 
                                        return res.redirect(links[counter].href)
                                    }
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                res.redirect('/err');
                            });
                    }
                });
            }
        })
    }
});

// success page 
router.use('/success', (req, res) => {

    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };
    // calling the final payment execute method
    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        if (error) {
            console.error(error);
        } else {
            if (payment.state === 'approved') {
                res.send('payment completed successfully');
                User.findByIdAndUpdate(currentUser._id, {
                    $inc: { 'wallet': amount },
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
                res.send('payment not successful');
            }
        }
    });
})

// error page 
router.use('/err', (req, res) => {
    console.log(req.query);
    res.redirect('https://soundcloud.com/');
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
