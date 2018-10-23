const express = require('express');
const router = express.Router();
const urlController = require('./url.controller');

// routes
router.post('/submit', submit);
router.get('/search/', search);
router.get('/', getByUserId);
router.get('/:id', getById);
router.put('/:id', update);
// router.put('/analytics/:id', analytics);
router.put('/:id', update);


module.exports = router;

function submit(req, res, next) {
    urlController.create(req)
        .then(url => url ? res.json({ "url": url }) : res.status(403).json({ 'message': ' the request was not processed' }).send(403))
        .catch(err => next(err));
}

function getByUserId(req, res, next) {
    urlController.getByUserId(req)
        .then(url => url = !null ? res.json(url) : res.sendStatus(403).json({ 'message': ' the request was not processed' }).send(403))
        .catch(err => {
            if (err == "Error, URL not found") {
                res.sendStatus(404)
            }
            else {
                next(err)
            }
        });
}
function getById(req, res, next) {
    urlController.getById(req.params.id)
        .then(url => {
            if (url == "Url not found") {
                res.status(404).send(url);
            } else {
                url ? res.json(url) : res.sendStatus(404)
            }

        })
        .catch(err => next(err));
}
function search(req, res, next) {
    urlController.search(req)
        .then(url => res.json(url))
        .catch(err => next(err));
}

function update(req, res, next) {
    urlController.update(req.params.id)
        .then((url) => {
            if (url) {
                res.json(url)     
            } else {
                res.json("Not found").send(404)
            }
        })
        .catch(err => next(err));
}
