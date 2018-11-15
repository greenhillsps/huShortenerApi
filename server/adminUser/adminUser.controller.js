const AdminUser = require('./adminUser.model');
const User = require('../user/user.model');
var bcrypt = require('bcryptjs'); // used to hash passwords
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const request = require('request');

const config = require('../../config/config'); // get config file

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
}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName 
 * @property {string} req.body.lastName 
 * @property {string} req.body.password
 * @property {string} req.body.email
 * @property {string} req.body.mobileNumber 
 * @returns {User}
 */


// function update(req, res, next) {

//   User.findOne(req.userId, function (err, admin) {
//     if (err) {
//       res.status(404);
//     } else {
//       User.findOne(req.body.id, function (err, user) {
//         if (err) {
//           res.status(404);
//         } else {
//           // console.log("She that B!^@H!", user)
//           let hashedPassword = bcrypt.hashSync(req.body.password, 8);
//           user.firstName = req.body.firstName;
//           user.lastName = req.body.lastName;
//           user.password = hashedPassword;
//           // user.email = req.body.email;
//           // user.mobileNumber = req.body.mobileNumber;

//           user.save()
//             .then((savedUser) => {
//               res.json(savedUser);
//             })
//             .catch(e => next(e));
//         }
//       })

//       console.log("LOL")

//     }
//   })
// }
module.exports = { register, login };
