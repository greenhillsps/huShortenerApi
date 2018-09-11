const express = require('express');
const router = express.Router();
const urlController = require('./url.controller');

// routes
router.post('/submit', submit);
router.get('/', getAll);
router.get('/:id', getByUserId);
router.put('/:id', update);
// router.put('/analytics/:id', analytics);
router.put('/:id', update);




module.exports = router;

function submit(req, res, next) {
    urlController.create(req.body)
        .then(url => url ? res.json({ "url": url }) : res.json({ 'message': ' the request was not processed' }).send(403))
        .catch(err => next(err));
}

function getByUserId(req, res, next) {
    urlController.getByUserId(req)
        .then(url => url = !null ? res.json(url) : res.json({ 'message': ' the request was not processed' }).send(403))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    urlController.getAll(req)
        .then(price => res.json(price))
        .catch(err => next(err));
}

function update(req, res, next) {
    urlController.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
