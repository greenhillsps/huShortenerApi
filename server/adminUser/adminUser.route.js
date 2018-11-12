const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../config/param-validation');
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const AdminController = require('./adminUser.controller');
const router = express.Router(); // eslint-disable-line new-cap


router.post('/login', AdminController.login);

// router.post('/logout', AdminController.logout);

router.post('/', AdminController.register)

module.exports = router;
