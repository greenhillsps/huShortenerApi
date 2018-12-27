const express = require('express');
const router = express.Router();
const urlController = require('./url.controller');
const paramValidation = require('./urlParam-validation');
const validate = require('express-validation');
const {append} =require('../helpers/helper');
// routes
router.post('/submit', [validate(paramValidation.createUrl), submit]);
router.get('/search/', [validate(paramValidation.createUrl), search]);
router.get('/', [validate(paramValidation.GetUrlByToken), getByUserId]);
router.get('/:id', [validate(paramValidation.GetUrl), getById]);
router.put('/:id', [validate(paramValidation.updateUrl), update]);
// router.put('/analytics/:id', analytics);
router.put('/:id', [update]);


module.exports = router;

function submit(req, res, next) {

// append(req.body.actualUrl).then(res=>{
//     req.body.actualUrl=res;
    urlController.create(req)
        .then(url => url ? res.json({ "url": url }) : res.status(403).json({ 'message': ' the request was not processed' }).send(403))
        .catch(err => next(err));
// }).catch(err=>{
//     next(err)
// })
    
    
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
                res.status(404).json("Oops! Url not found")
            }
        })
        .catch(err => next(err));
}
