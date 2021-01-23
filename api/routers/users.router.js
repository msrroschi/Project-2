const router = require('express').Router()

const { authUser } = require('../utils/index')
const {
  getUserById
} = require('../controllers/users.controller')

router
  .get('/:usersId', authUser, getUserById)

  module.exports = router