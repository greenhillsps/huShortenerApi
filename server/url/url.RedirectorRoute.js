const express = require('express');
const router = express.Router();
const redirectorController = require('./url.Redirector');

// routes
router.get('/:id', update);



function update(req, res, next) {
  redirectorController.update(req.params.id, req)
    .then(url => {
      if (url == "errorrrr, actual url not found") {
        res.json(url).sendStatus(404)
      }
      else if (url == "You Shall Not PASS!") {
        res.json(url).sendStatus(403)
      }
      else if (url == "Error, URL not found") {
        res.json(url).sendStatus(403)
      }
      else if (url == "Error, No alternate url provided") {
        res.json(url).sendStatus(403)
      } else {
        res.redirect(url)
      }
    })
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

