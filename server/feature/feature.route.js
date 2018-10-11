const express = require('express');
const router = express.Router();
const featureController = require('./feature.controller');

// routes
router.get('/check', (req, res) => {
    res.sendStatus(200)
});
router.put('/buy/:id', update);



function update(req, res, next) {
    featureController.update(req.params.id, req)
        .then((feature) => {
            if (feature == "Insufficient funds") {
                res.json(feature).send(403)
            } else if (feature == "Already exist") {
                res.json(feature).send(401)
            } else {
                res.json(feature)
            }
        })
        .catch(err => next(err));
}


module.exports = router;    