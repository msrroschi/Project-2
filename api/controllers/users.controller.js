const userModel = require('../models/users.model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { handleError } = require('../utils/index')

function getAllUsers(req, res) {
  userModel
    .find()
    .then(users => {
      res.json(users)
    })
    .catch(err => handleError(err, res))
}

function getUserById(req, res) {
  userModel
    .findById(req.params.userId)
    .populate('finishedGames')
    .populate('pendingGames')
    .populate('favouriteGames')
    .populate('ratings')
    .then(user => {
      console.log(user.finishedGames)
      res.json(user)
    })
    .catch(err => handleError(err, res))
}

function getMe(req, res) {
  console.log(res.locals)
  console.log('hola')
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      res.send(user)
    })
    .catch(err => handleError(err, res))
}

function editMe(req, res) {
  if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
  }
  userModel
    .findOneAndUpdate({
      email: res.locals.user.email
    }, req.body)
    .then(user => {
      res.json(user)
    })
    .catch(err => handleError(err, res))
}

// function deleteMe(req, res) {
//   userModel
//     .findOneAndDelete({ email: res.locals.user.email })
//     .then(result => {
//       console.log(result)
//       res.send(result)
//     })
//     .catch(err => handleError(err, res))
// }

function getMyfollows(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      res.json(user.follows)
    })
    .catch(err => handleError(err, res))
}

function addToFollows(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      user.follows.push(mongoose.Types.ObjectId(req.params.userId))
      user.save(err => {
        if (err) res.status(500).send('Change not saved')
        userModel
          .findById(req.params.userId)
          .then(follow => {
            follow.followers.push(user._id)
            follow.save(err => {
              if (err) res.status(500).send('Change not saved')
            })
          })
        res.json(user.follows)
      })
    })
    .catch(err => handleError(err, res))
}

function deleteFromFollows(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      user.follows.splice(user.follows.indexOf(req.params.userId))
      user.save(err => {
        if (err) res.status(500).send('Change not saved')
        userModel
          .findById(req.params.userId)
          .then(follow => {
            follow.followers.splice(user._id, 1)
            follow.save(err => {
              if (err) res.status(500).send('Change not saved')
            })
          })
        res.json(user.follows)
      })
    })
    .catch(err => handleError(err, res))
}

function getMyFinished(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      res.json(user.finishedGames)
    })
    .catch(err => handleError(err, res))
}

function addGameToFinished(req, res) {
  console.log(res.locals.user.email)
  console.log('controller' + req.params.gameId)
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      user.finishedGames.push(req.params.gameId)
      user.save(err => {
        if (err) res.status(500).send('Change not saved')

        console.log(user.pendingGames)
        console.log(user.pendingGames.indexOf(req.params.gameId))
        
        user.pendingGames.splice(user.pendingGames.indexOf(req.params.gameId), 1)
        user.save(err => {
          if (err) res.status(500).send('Change not saved')
        })
        res.json(user.finishedGames)
      })
    })
    .catch(err => handleError(err, res))
}

function deleteGameFromFinished(req, res) {
  userModel
  .findOne({ email: res.locals.user.email })
  .then(user => {
    if (user.finishedGames.includes(req.params.gameId)) {
      user.finishedGames.splice(user.finishedGames.indexOf(req.params.gameId), 1)
      user.save(err => {
        if (err) res.status(500).send('Change not saved')
        res.json(user.finishedGames)
      })
    } else {
      res.send('This game was not found')
    }
  })
  .catch(err => handleError(err, res))
}

function getMyPending(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      res.json(user.pendingGames)
    })
    .catch(err => handleError(err, res))
}

function addGameToPending(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      user.pendingGames.push(mongoose.Types.ObjectId(req.params.gameId))
      user.save(err => {
        if (err) res.status(500).send('Change not saved')
        user.finishedGames.splice(user.finishedGames.indexOf(req.params.gameId), 1)
        user.save(err => {
          if (err) res.status(500).send('Change not saved')
        })
        res.json(user.pendingGames)
      })
    })
    .catch(err => handleError(err, res))
}

function deleteGameFromPending(req, res) {
  userModel
  .findOne({ email: res.locals.user.email })
  .then(user => {
    if (user.pendingGames.includes(req.params.gameId)) {
      user.pendingGames.splice(user.pendingGames.indexOf(req.params.gameId), 1)
      user.save(err => {
        if (err) res.status(500).send('Change not saved')
        res.json(user.pendingGames)
      })
    } else {
      res.send('This game was not found')
    }
  })
  .catch(err => handleError(err, res))
}

function getMyFavourites(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      res.json(user.favouriteGames)
    })
    .catch(err => handleError(err, res))
}

function addGameToFavourites(req, res) {
  userModel
    .findOne({ email: res.locals.user.email })
    .then(user => {
      user.favouriteGames.push(mongoose.Types.ObjectId(req.params.gameId))
      user.save(err => {
        if (err) res.status(500).send('Change not saved')
        res.json(user.favouriteGames)
      })
    })
    .catch(err => handleError(err, res))
}

function deleteGameFromFavourites(req, res) {
  userModel
  .findOne({ email: res.locals.user.email })
  .then(user => {
    if (user.favouritesGames.includes(req.params.gameId)) {
      user.favouriteGames.splice(user.favouriteGames.indexOf(req.params.gameId), 1)
      user.save(err => {
        if (err) res.status(500).send('Change not saved')
        res.json(user.favouriteGames)
      })
    } else {
      res.send('This game was not found')
    }
  })
  .catch(err => handleError(err, res))
}

module.exports = {
  getAllUsers,
  getUserById,
  getMe,
  editMe,
  // deleteMe,
  getMyfollows,
  addToFollows,
  deleteFromFollows,

  // Finished
  getMyFinished,
  addGameToFinished,
  deleteGameFromFinished,

  // Pending
  getMyPending,
  addGameToPending,
  deleteGameFromPending,

  // Favourites
  getMyFavourites,
  addGameToFavourites,
  deleteGameFromFavourites
}