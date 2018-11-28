const express = require("express");
// const validate = require('express-validation');
// const paramValidation = require('../../config/param-validation');
// const expressJwt = require('express-jwt');
// const config = require('../../config/config');
const AdminController = require("./adminOp.controller");
const router = express.Router(); // eslint-disable-line new-cap

router.put("/:userId", AdminController.update);
router.put("/updatePassword/:userId", AdminController.updatePassword);
router.get('/getUrlByUser/:userId', AdminController.getUrlByUser);
router.get('/urlAnalytics/:urlId', AdminController.urlAnalytics);

/////****************Custom Expiry Urls*****************///////////
router.get('/customExpiryUrls/:userId', AdminController.customExpiryUrls);
router.put('/updateCustomExpiry/:urlId', AdminController.updateCustomExpiry);

/////****************Rediret To Urls*****************///////////
router.get('/redirectToUrls/:userId', AdminController.redirectToUrls);
router.put('/updateUrlRedirect/:urlId', AdminController.updateUrlRedirect);

/////****************404 Management*****************///////////
router.get('/fourOFourUrls/:userId', AdminController.fourOFourUrls);
router.put('/updateFourOFourUrls/:urlId', AdminController.updateFourOFourUrls);

/////****************Blacklist Protection*****************///////////
router.get('/blackListProtectedUrls/:userId', AdminController.blackListProtectedUrls);
router.put('/updateBlackListIPs/:urlId', AdminController.updateBlackListIPs);

/////****************Active / Inactive URLs*****************///////////
router.get('/toggleActivationUrls/:userId', AdminController.toggleActivationUrls);
router.put('/toggleActivationOfUrl/:urlId', AdminController.toggleActivationOfUrl);

module.exports = router;
