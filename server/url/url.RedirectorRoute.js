const express = require('express');
const router = express.Router();
const redirectorController = require('./url.Redirector');

// routes
router.get('/:id', update);



function update(req, res, next) {
  redirectorController.update(req.params.id, req)
    .then(url => url ? res.redirect(url) : res.sendStatus(404))
    .catch(err => {
      if (err == "errorrrr, actual url not found") {
        res.sendStatus(404)
      }
      else {
        next(err)
      }
    });
}
module.exports = router;

