const express = require('express');
const router = express.Router();
const featureController = require('./features.controller');

// routes
router.put('/:id', update);




module.exports = router;

function update(req, res, next) {
    featureController.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
