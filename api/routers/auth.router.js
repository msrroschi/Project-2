const router = require('express').Router()

const { authUser } = require('../utils/index')
const {
  signUp,
  logIn,
  logOut
} = require('../controllers/auth.controller')

router
  .post('/signup', signUp)
  .post('/login', logIn)
  .get('/logout', authUser, logOut)

module.exports = router