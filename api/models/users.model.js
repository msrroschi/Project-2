const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator (value) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
      }
    },
    unique: [true, 'This is email is registered']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  ratings: [{
    // type: mongoose.Schema.Types.ObjectId,
    // ref: rate
  }],
  finishedGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'game'
  }],
  pendingGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'game'
  }],
  favouriteGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'game'
  }],
  follows: [{
    // type: mongoose.Schema.Types.ObjectId,
    // ref: user
  }],
  followers: [{
    // type: mongoose.Schema.Types.ObjectId,
    // ref: user
  }],
  yourPlattforms: {
    steam: Boolean,
    battlenet: Boolean,
    geforcenow: Boolean,
    googleStadia: Boolean,
    origin: Boolean,
    ubisoftConnect: Boolean
  },
  cratedAt: {
    type: Date,
    default: Date.now
  }
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel