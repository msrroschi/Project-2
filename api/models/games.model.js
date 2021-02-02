const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  name: {
    type: String
  },
  genre: [{
    type: String
  }],
  plattforms: [{
    type: String
  }],
  releaseDate: {
    type: Date
  },
  popularity: {
    type: Number
  },
  comments: [{
    // type: mongoose.Schema.Types.ObjectId,
    // ref: rate
  }],
  image: {
    type: String
  },
  rawg_id: String
})

const gameModel = mongoose.model('game', gameSchema)

module.exports = gameModel