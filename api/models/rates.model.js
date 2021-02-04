const mongoose = require('mongoose')

const rateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'game',
    required: true
  },
  rate: {
    type: Number,
    required: true,
    min: [0, 'Too bad, the min is 0'],
    max: [10, 'Too good, the max is 10']
  },
  comment: {
    type: String,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const rateModel = mongoose.model('rate', rateSchema)

module.exports = rateModel