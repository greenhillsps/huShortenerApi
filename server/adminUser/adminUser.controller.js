const AdminUser = require('./adminUser.model');
var bcrypt = require('bcryptjs'); // used to hash passwords
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const request = require('request');

const config = require('../../config/config'); // get config file


function login(req, res, next) {

  AdminUser.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send({ msg: "Username or password is incorrect", auth: false, token: null });

    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ msg: "Username or password is incorrect", auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id }, config.jwtSecret,
      // { expiresIn: 86400 // expires in 24 hours}
    );

    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token, user: user });
  });
  return next
};


async function register(req, res, next) {

  if (await AdminUser.findOne({ email: req.body.email })) {

    res.status(403)
      .json({
        Status: '403',
        message: ' email ' + req.body.email + ' is already taken'
      })
      .send()
  } else {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new AdminUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    });

    var token;
    // { expiresIn: 86400 // expires in 24 hours}


    await user.save()
      .then(User => {
        token = jwt.sign({ id: User._id }, config.jwtSecret,
          // { expiresIn: 86400 // expires in 24 hours}
          // console.log(User)

        );
        res.status(200).send({ auth: true, token: token, user: User })
      })
      // .then(User => res.status(200).send({ auth: true, token: token, user: User }))
      .catch(e => next(e));
  }
}
module.exports = { register, login };
