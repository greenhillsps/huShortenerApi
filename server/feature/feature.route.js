const express = require('express');
const router = express.Router();
const featureController = require('./feature.controller');
const paramValidation = require('./featureParam-validation');
const validate = require('express-validation');
// routes
router.get('/check', (req, res) => {
    res.sendStatus(200)
});
router.put('/buy/:id', [validate(paramValidation.update), update]);



function update(req, res, next) {
    featureController.update(req.params.id, req)
        .then((feature) => {
            if (feature == "Insufficient funds") {
                res.status(403).json(feature)
            } else if (feature == "Already exist") {
                res.status(401).json(feature)
            } else if (feature == "Can't do!") {
                res.status(401).json("Oops! Url not found")
            } else {
                res.json(feature)
            }
        })
        .catch(err => next(err));
}


module.exports = router;    