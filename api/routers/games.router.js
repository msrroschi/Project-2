const router = require('express').Router()

const {
  getGameById,
  getGameByName,
  getAllGames
} = require('../controllers/games.controller')

router
  .get('/:name', getGameByName)
  .get('/:gameId', getGameById)
  .get('', getAllGames)


module.exports = router