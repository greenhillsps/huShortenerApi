const express = require('express');
const router = express.Router();
const urlController = require('./url.controller');

// routes
router.post('/submit', submit);
// router.get('/', getAll);
router.get('/', getByUserId);
router.get('/:id', getById);
router.put('/:id', update);
// router.put('/analytics/:id', analytics);
router.put('/:id', update);




module.exports = router;

function submit(req, res, next) {
    urlController.create(req)
        .then(url => url ? res.json({ "url": url }) : res.json({ 'message': ' the request was not processed' }).send(403))
        .catch(err => next(err));
}

function getByUserId(req, res, next) {
    urlController.getByUserId(req)
        .then(url => url = !null ? res.json(url) : res.json({ 'message': ' the request was not processed' }).send(403))
        .catch(err => next(err));
}
function getById(req, res, next) {
    urlController.getById(req.params.id)
        .then(price => price ? res.json(price) : res.sendStatus(404))
        .catch(err => next(err));
}
function getAll(req, res, next) {
    urlController.getAll(req)
        // .then(console.log(" userId from geturl", req.userId))
        .then(url => res.json(url))
        .catch(err => next(err));
}

function update(req, res, next) {
    urlController.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}
