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
router.get('/customExpiryUrls/:userId', AdminController.customExpiryUrls);
router.put('/updateCustomExpiry/:urlId', AdminController.updateCustomExpiry);
router.get('/redirectToUrls/:userId', AdminController.redirectToUrls);
router.put('/updateUrlRedirect/:urlId', AdminController.updateUrlRedirect);

module.exports = router;
