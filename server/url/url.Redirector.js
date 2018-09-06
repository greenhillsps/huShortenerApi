const express = require('express');


const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/:id', (req, res) =>
  res.send('OK')
);


module.exports = router;
