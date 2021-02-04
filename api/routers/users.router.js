const router = require('express').Router()

const { authUser } = require('../utils/index')
const {
  getAllUsers,
  getUserById,
  getUserByName,
  getMe,
  editMe,
  // deleteMe,
  getMyfollows,
  addToFollows,
  deleteFromFollows,
  getMyFinished,
  addGameToFinished,
  deleteGameFromFinished,
  getMyPending,
  addGameToPending,
  deleteGameFromPending,
  getMyFavourites,
  addGameToFavourites,
  deleteGameFromFavourites
} = require('../controllers/users.controller')

router
  .get('/', getAllUsers)
  .get('/me', authUser, getMe)
  .get('/me/:userName', authUser, getUserByName)
  .get('/:userId', authUser, getUserById)
  .put('/me', authUser, editMe)
  // .delete('/me', authUser, deleteMe)

  // Follows
  .get('/me/follows', authUser, getMyfollows)
  .post('/me/:userId', authUser, addToFollows)
  .delete('/me/:userId', authUser, deleteFromFollows)

  // Finished
  .get('/me/finished', authUser, getMyFinished)
  .post('/me/finished/:gameId', authUser, addGameToFinished)
  .delete('/me/finished/:gameId', authUser, deleteGameFromFinished)

  //Pending
  .get('/me/pending', authUser, getMyPending)
  .post('/me/pending/:gameId', authUser, addGameToPending)
  .delete('/me/pending/:gameId', authUser, deleteGameFromPending)

  // Favourites
  .get('/me/favourites', authUser, getMyFavourites)
  .post('/me/favourites/:gameId', authUser, addGameToFavourites)
  .delete('/me/favourites/:gameId', authUser, deleteGameFromFavourites)

  module.exports = router