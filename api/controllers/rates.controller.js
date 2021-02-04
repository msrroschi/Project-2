const rateModel = require('../models/rates.model')
const userModel = require('../models/users.model')
const { handleError } = require('../utils/index')

function postRate(req, res) {
  rateModel
    .create({
      user: res.locals.user._id,
      game: req.body.game,
      rate: req.body.rate,
      comment: req.body.comment
    })
    .then(rate => {
      userModel
        .findById(res.locals.user._id)
        .then(user => {
          user.ratings.push(rate._id)
          user.save(err => {
            if (err) res.status(500).send('Change not saved')
          })
        })
      res.json(rate)
    })
    .catch(err => handleError(err, res))
}

function getRateById(req, res) {
  rateModel
    .findById(req.params.rateId)
    .then(rate => res.json(rate))
    .catch(err => handleError(err, res))
}

module.exports = {
  postRate,
  getRateById
}