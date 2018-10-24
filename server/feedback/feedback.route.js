const express = require('express');
const router = express.Router();
const feedbackService = require('./feedback.controller');
const paramValidation = require('./feedbackParam-validation');
const validate = require('express-validation');

// routes
router.post('/submit', [validate(paramValidation.submit), submit]);
router.get('/', getAll);
router.get('/:id', [validate(paramValidation.GetFeedback), getById]);
router.put('/:id', [validate(paramValidation.update), update]);

module.exports = router;

function submit(req, res, next) {
    feedbackService.create(req.body)
        .then(feedback => res.json({ "message": "Feedback submitted successfully" }).send(feedback))
        .catch(err => next(err));
}

function getById(req, res, next) {
    feedbackService.getById(req.params.id)
        .then(feedback => feedback ? res.json(feedback) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    feedbackService.getAll(req, res)
        .then(feedback => res.json(feedback))
        .catch(err => next(err));
}

function update(req, res, next) {
    feedbackService.update(req.params.id, req.body)
        .then(url => url ? res.json(url) : res.status(403).json({ 'message': ' Request failed please try again' }))
        .catch(err => next(err));
}
