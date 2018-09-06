const User = require('./user.model');
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.firstName 
 * @property {string} req.body.lastName 
 * @property {string} req.body.password
 * @property {string} req.body.email
 * @property {string} req.body.mobileNumber 
 * @returns {User}
 */
async function create(req, res, next) {

  if (await User.findOne({ email: req.body.email })) {
    
    res.status(403)
      .json({
        Status: '403',
        message: ' email ' + req.body.email + ' is already taken'
      })
      .send()
  } else {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber
    });

    await user.save()
      .then(savedUser => res.json(savedUser))
      .catch(e => next(e));
  }
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
function update(req, res, next) {
  const user = req.user;
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.password = req.body.password;
  user.email = req.body.email;
  user.mobileNumber = req.body.mobileNumber;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
