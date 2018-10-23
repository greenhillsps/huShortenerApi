const express = require('express');
const router = express.Router();
const redirectorController = require('./url.Redirector');

// routes
router.get('/:id', update);



function update(req, res, next) {
  redirectorController.update(req.params.id, req)
    .then((url) => {
      if (url == "This URL is deactivated by the owner!") {
        res.status(403).json(url)
      }
      else if (url == "You Shall Not PASS!") {
        res.status(403).json(url)
      }
      else if (url == "Error, URL not found") {
        res.status(404).json(url)
      }
      else if (url == "Error, No alternate url provided") {
        res.status(403).json(url)

      }
      else if (url == "You PASS!") {
        res.status(403).json(url)

      } else {
        // console.log("This is the responseeeeeeeeeeeeeeeeeeeeeeeeeeee ", res, "AANNDD this is X", url.stat)
        // if (req.headers.authorization) {
        res.redirect(url.stat, url.rer)
        // } else {
        // res.redirect(301, url)
        // }
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

