require('dotenv').config()

const mongoose = require('mongoose')
const axios = require('axios').default
const Games = require('./api/models/games.model')

function gameGenres(game) {
  const genres = []
  if (game && game.genres && Array.isArray(game.genres)) {
    game.genres.forEach(genre => {
      genres.push(genre.name)
    })
    return genres
  }
}

function gamePlattforms(game) {
  const platforms = []
  if (game && game.platforms && Array.isArray(game.platforms)) {
    game.platforms.forEach(platform => {
      platforms.push(platform.platform.name)
    })
    return platforms
  }
}

async function insertGame(game){
  console.log(gameGenres(game), gamePlattforms(game))
  try {
    Games.create({
      name: game.name,
      genre: gameGenres(game),
      plattforms: gamePlattforms(game),
      releaseDate: game.released,
      popularity: 0,
      comments: [],
      image: game.background_image,
      rawg_id: game.id
    })
  } catch (error) {
   console.log(error)
  }
}

function makeRequest(url){
  axios.get(url)
  .then(results => {
    results.data.results.forEach(game => insertGame(game))
    setTimeout(makeRequest , 2000, results.data.next)
  })
}

mongoose.connect(process.env.MONGO_URL,
  {
    dbName: process.env.MONGO_DB || 'test',
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }, err => {
    if (err) { throw new Error(err) }
    console.info('💾 Connected to Mongo Database \n')
    
    const url = 'https://api.rawg.io/api/games'

    setTimeout(makeRequest, 2000, url)
  })