const gameModel = require('../models/games.model')
const { handleError } = require('../utils/index')

function getGameById(req, res) {
  gameModel
    .findById(req.params.gameId)
    .then(game => {
      res.json(game)
    })
    .catch(err => handleError(err, res))
}

function getAllGames(req, res) {
  gameModel
    .find()
    .then(games => {
      res.json(games)
    })
    .catch(err => handleError(err, res))
}

module.exports = {
  getGameById,
  getAllGames
}