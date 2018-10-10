var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config'); // get our config file

function verifyToken(req, res, next) {
  let token = req.headers.authorization;
  let feedback = new RegExp('/api/feedback/submit');
  let url = new RegExp('/api/url/submit');
  // let url = new RegExp('/api/paypal/buy/');


  if (url.test(req.originalUrl) || feedback.test(req.originalUrl)) {
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (token && err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.userId = decoded ? decoded.id : null;
        console.log("userid from verifyToken", req.userId)
        return next();
      }

    });
  } else {
    // check header or url parameters or post parameters for token
    if (!token) {
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    else if (token && !(url.test(req.originalUrl)) && !(feedback.test(req.originalUrl))) {
      // verifies secret and checks exp
      jwt.verify(token, config.jwtSecret, function (err, decoded) {
        if (err) {
          return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.userId = decoded.id;
          console.log("userid from verifyToken", req.userId)
          next();
        }
      });
    } else {
      next()
    }
  }
}

module.exports = verifyToken;