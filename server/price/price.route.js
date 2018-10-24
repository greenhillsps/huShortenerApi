const express = require('express');
const router = express.Router();
const priceController = require('./price.controller');
const paramValidation = require('./priceParam-validation');
const validate = require('express-validation');
// routes
router.post('/submit', [validate(paramValidation.createPrice), submit]);
router.get('/', getAll);
router.get('/:id', [validate(paramValidation.GetPrice), getById]);
router.put('/:id', [validate(paramValidation.updatePrice), update]);

module.exports = router;

function submit(req, res, next) {
    priceController.create(req.body)
        .then(url => url ? res.status(200).json(url) : res.status(403).json({ 'message': ' Request failed please try again' }))
        .catch(err => next(err));
}

function getById(req, res, next) {
    priceController.getById(req.params.id)
        .then(price => price ? res.json(price) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    priceController.getAll()
        .then(price => res.json(price))
        .catch(err => next(err));
}

function update(req, res, next) {
    priceController.update(req.params.id, req.body)
        .then(url => url ? res.json({ "message": "The price has updated" }).send(200) : res.status(403).json({ 'message': ' Request failed please try again' }))
        .catch(err => next(err));
}
