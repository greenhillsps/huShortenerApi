
var express = require('express');
const router = express.Router();
var paypal = require('paypal-rest-sdk');
const User = require('../user/user.model');


// success page 
router.use('/success', (req, res) => {

    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };
    console.log("This is the payment iddddddddddddddddddddddddddddddddddddddddddddd", paymentId)
    // calling the final payment execute method
    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        if (error) {
            console.error(error);
        } else {
            if (payment.state === 'approved') {
                console.log(payment)
                res.redirect('http://dotlydev.herokuapp.com/success');
                User.findOne({ paymentId: { $all: [paymentId] } }, function (err, user) {
                    if (err) {
                        console.log("User could not be updated in payment execution", err)
                    } else {
                        console.log("This is the payment amount: ", payment.transactions[0].amount.total);
                        // user.wallet += parseInt(payment.transactions[0].amount.total);
                        // user.transactionHistory.push(payment)
                        // console.log("This is the current user: ", user);
                        // console.log("This is the payment object: ", payment);
                        User.findByIdAndUpdate(user._id, {
                            $inc: { 'wallet': parseInt(payment.transactions[0].amount.total) },
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
                    }
                })
            } else {
                res.redirect('http://dotlydev.herokuapp.com/failure');
            }
        }
    });
})

// error page 
router.use('/err', (req, res) => {
    console.log(req.query);
    // res.redirect('https://soundcloud.com/');
    res.redirect('http://dotlydev.herokuapp.com/failure');

})

module.exports = router;

// Tutorial link: https://www.nodejsera.com/paypal-payment-integration-using-nodejs-part2.html
// Create user experience profile : https://github.com/paypal/PayPal-node-SDK/blob/master/samples/payment_experience/web_profile/create_payment_with_customized_experience.js#L25
// paypal tutorial https://developer.paypal.com/docs/checkout/how-to/server-integration/#1-set-up-your-client-to-call-your-server