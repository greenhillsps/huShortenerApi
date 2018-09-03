const express = require('express');
const router = express.Router();
const feedbackService = require('./feedback.controller');

// routes
router.post('/submit', submit);
router.get('/', getAll);
router.get('/:id', getById);
// router.get('/current', getCurrent);
router.put('/:id', update);
// router.delete('/:id', _delete);

module.exports = router;

function submit(req, res, next) {
    feedbackService.create(req.body)
        .then(feedback => res.send(feedback))
        .catch(err => next(err));
}

function getById(req, res, next) {
    feedbackService.getById(req.params.id)
        .then(feedback => feedback ? res.json(feedback) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    feedbackService.getAll()
        .then(feedback => res.json(feedback))
        .catch(err => next(err));
}

// function getCurrent(req, res, next) {
//     feedbackService.getById(req.params.sub)
//         .then(feedback => feedback ? res.json(feedback) : res.sendStatus(404))
//         .catch(err => next(err));
// }

function update(req, res, next) {
    feedbackService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

// function _delete(req, res, next) {
//     feedbackService.delete(req.params.id)
//         .then(() => res.json({}))
//         .catch(err => next(err));
// }