const router = require('express').Router()

const {
  getGameById,
  getAllGames
} = require('../controllers/games.controller')

router
  .get('/games/:gammeId', getGameById)
  .get('', getAllGames)


module.exports = router