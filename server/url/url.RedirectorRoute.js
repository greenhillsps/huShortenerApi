const express = require('express');
const router = express.Router();
const redirectorController = require('./url.Redirector');

// routes
router.put('/:id', update);

module.exports = router;

function update(req, res, next) {
  redirectorController.update(req.params.id, req.body)
    .then(url => url ? res.redirect(url) : res.sendStatus(404))
    // .then (console.log(req.headers.user-agent))
    .catch(err => next(err));
}

// .then(url => url ? res.redirect(url) : res.sendStatus(404))
// .then(url => url ? res.json(url) : res.sendStatus(404))
