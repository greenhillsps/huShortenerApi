const express = require('express');
const router = express.Router();
const redirectorController = require('./url.Redirector');

// routes
router.get('/:id', getById);

module.exports = router;

function getById(req, res, next) {
  redirectorController.getById(req.params.id)
    .then(url => url ? res.redirect(url) : res.sendStatus(404))
    // .then (console.log(req.headers.user-agent))
    .catch(err => next(err));
}

// .then(url => url ? res.redirect(url) : res.sendStatus(404))
// .then(url => url ? res.json(url) : res.sendStatus(404))
