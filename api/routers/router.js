const router = require('express').Router()

const userRouter = require('./users.router')
const authRouter = require('./auth.router')
const gamesRouter = require('./games.router')

router
  .use('/users', userRouter)
  .use('/auth', authRouter)
  .use('/games', gamesRouter)

module.exports = router