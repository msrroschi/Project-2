const jwt = require('jsonwebtoken')
const UserModel = require('../models/users.model')

// Authenticate Middleware
function authUser (req, res, next) {
  console.log('authUser')
  if (!req.headers.token) {
    console.log('hi')
    res.status(403).json({ error: 'No Token found' })
  } else {
    console.log('2')
    jwt.verify(req.headers.token, process.env.SECRET, (err, token) => {
      if (err) { res.status(403).json({ error: 'Token not valid' }) }
      UserModel
        .findOne({ email: token.email })
        .then(user => {
          console.log('me encontro')
          res.locals.user = user
          next()
        })
        .catch(err => res.json(err))
    })
  }
}

// Return HTTP error with details in JSON
function handleError (err, res) {
  return res.status(400).json(err)
}

module.exports = {
  authUser,
  handleError
}