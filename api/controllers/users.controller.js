const userModel = require('../models/users.model')

function getUserById(req, res) {
  const userId = req.params.usersId
  userModel
    .findById(userId)
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.status(500).send('User not found!!!')
    })
}

module.exports = {
  getUserById
}