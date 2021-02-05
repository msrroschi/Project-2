const userModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { handleError } = require('../utils/index')

function signUp (req, res) {
  if (req.body && req.body.password) {
    const encryptedPasswd = bcrypt.hashSync(req.body.password, 10)
    userModel
      .create({
        username: req.body.username,
        email: req.body.email,
        password: encryptedPasswd
      })
      .then(user => {
        const data = { email: user.email, name: user.name }
        const token = jwt.sign(data, process.env.SECRET)

        res.status(200).json({ token: token, ...data })
      })
      .catch(err => handleError(err, res))
  }
}

function logIn (req, res) {
  userModel
    .findOne({
      email: req.body.email,
    })
    .select('password email username')
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const data = { email: user.email, username: user.username }
          const token = jwt.sign(data, process.env.SECRET)
          res.status(200).json({ token: token, ...data })
        } else {
          res.send('passwords do not match')
        }
      } else {
        res.send('User email not found')
      }
    })
    .catch(err => handleError(err))
}

function logOut(req, res) {
  console.log(res)
  res.send('hi')
}

module.exports = {
  signUp,
  logIn,
  logOut
}