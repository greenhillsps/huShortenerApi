const express = require('express');
const router = express.Router();
const urlController = require('./url.controller');

// routes
router.post('/submit', submit);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);

module.exports = router;

function submit(req, res, next) {
    urlController.create(req.body)
        .then(url => res.send(url))
        .catch(err => next(err));
}

function getById(req, res, next) {
    urlController.getById(req.params.id)
        .then(url => url ? res.json(url) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    urlController.getAll()
        .then(price => res.json(price))
        .catch(err => next(err));
}

function update(req, res, next) {
    urlController.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
