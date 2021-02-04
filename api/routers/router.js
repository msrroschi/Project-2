const router = require('express').Router()

const userRouter = require('./users.router')
const authRouter = require('./auth.router')
const gamesRouter = require('./games.router')
const ratesRouter = require('./rates.router')

router
  .use('/users', userRouter)
  .use('/auth', authRouter)
  .use('/games', gamesRouter)
  .use('/rates', ratesRouter)

module.exports = router