const gameModel = require('../models/games.model')
const { handleError } = require('../utils/index')

function getGameById(req, res) {
  console.log(req.params)
  gameModel
    .findById(req.params.gameId)
    .then(game => {
      console.log(game)
      res.json(game)
    })
    .catch(err => handleError(err, res))
}

function getGameByName(req, res) {
  gameModel
    .findOne({ name: req.params.name})
    .then(game => res.json(game))
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
  getGameByName,
  getAllGames
}