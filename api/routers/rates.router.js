const router = require('express').Router()

const { authUser } = require('../utils/index')
const {
  postRate,
  getRateById
} = require('../controllers/rates.controller')

router
  .post('/me', authUser, postRate)
  .get('/me/:rateId', authUser, getRateById)

  module.exports = router