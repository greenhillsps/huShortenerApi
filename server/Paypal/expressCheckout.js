
var express = require('express');
const router = express.Router();
var path = require('path');
var app = express();
var paypal = require('paypal-rest-sdk');


// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': 'AZQ2SKAmbnBvcdvLhm0DmVpQr9_zzF2YYodDsB6uFA1b-WzeLwZQUxq-7fo__-mPFSwyabQKtrFD5lhQ', // client id
    'client_secret': 'EKL1xgG4Mb8ZmE9m8h4P3sidARvSHZYquQQu0zUYjfgk5IlFmOfB9O1N7K0jpUUjDspNNodFuGWfGNlT' // client secret 
});


// set public directory to serve static html files 
// app.use('/', express.static(path.join(__dirname, 'public'))); 


// redirect to store when user hits http://localhost:3000
// app.get('/' , (req , res) => {
//     res.redirect('/index.html'); 
// })

// payment process 
router.use('/buy', (req, res) => {


    // payment object 
    var payment = {
        "intent": "authorize",
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
                    "name": 'item1',
                    "sku": "item",
                    "price": '39',
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "total": 39.00,
                "currency": "USD"
            },
            "description": "A feature "
        }]
    }


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
});


// success page 
router.use('/success', (req, res) => {


    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };

    paypal.payment.execute(paymentId, payerId, function(error, payment){
        if(error){
            console.error(error);
        } else {
            if (payment.state === 'approved'){ 
                res.send('payment completed successfully');
                console.log(payment);
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

// app.get('/success', function(req, res) {
//     var paymentId = req.query.paymentId;
//     var payerId = { 'payer_id': req.query.PayerID };

//     paypal.payment.execute(paymentId, payerId, function(error, payment){
//         if(error){
//             console.error(error);
//         } else {
//             if (payment.state === 'approved'){ 
//                 res.send('payment completed successfully');
//                 console.log(payment);
//             } else {
//                 res.send('payment not successful');
//             }
//         }
//     });
// });

module.exports = router;


// Tutorial link: https://www.nodejsera.com/paypal-payment-integration-using-nodejs-part2.html