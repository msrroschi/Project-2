// const { default: axios } = require("axios");

const urlParams = new URLSearchParams(window.location.search);

let globalGame = {}

window.onload = () => {

  // Check if logged
  if (localStorage.token) {
    document.getElementById('signup-navbar').style.display = 'none'
    document.getElementById('login-navbar').style.display = 'none'
    document.getElementById('logout-btn').style.display = 'inline-block'
  } else {
    document.getElementById('signup-navbar').style.display = 'inline-block'
    document.getElementById('login-navbar').style.display = 'inline-block'
    document.getElementById('logout-btn').style.display = 'none'
  }


  axios
    .get(`http://localhost:3000/api/games/${urlParams.get('game')}`)
    .then(game => {
      
      globalGame = game.data

      // Game image
      document.getElementById('game-img').innerHTML += `
      <img src="${game.data.image}" alt="Game Image">
      `

      // Game Title
      document.querySelector('#game-title h1').innerText = game.data.name

      // Add Buttons
      if (localStorage.token) {
        axios
          .get('http://localhost:3000/api/users/me', {
            headers: {
              token: localStorage.token
            }
          })
          .then(me => {
            if (me.data.finishedGames.includes(game.data._id)) {
              document.getElementById('finished-button').classList.remove('btn-outline-dark')
              document.getElementById('finished-button').classList.add('btn-dark')
            }
            if (me.data.pendingGames.includes(game.data._id)) {
              document.getElementById('pending-button').classList.remove('btn-outline-dark')
              document.getElementById('pending-button').classList.add('btn-dark')
            }
            if (me.data.favouriteGames.includes(game.data._id)) {
              document.getElementById('favourites-button').classList.remove('btn-outline-dark')
              document.getElementById('favourites-button').classList.add('btn-dark')
            }
          })
          .catch(err => console.log(err))
      }

      // Game Rating and Popularity
      axios
        .get('http://localhost:3000/api/users')
        .then(users => {
          console.log(game.data)
          let rate = 0
          let usersWhoRated = 0
          let popularity = 0
          users.data.forEach(user => {
            user.ratings.forEach(rating => {
              if (rating.game === game.data._id) {
                rate += rating.rate
                usersWhoRated++
              }
            })
            console.log(user.finishedGames)
            user.finishedGames.forEach(gameId => {
              if (gameId === game.data._id) popularity++
            })
            console.log(user.pendingGames)
            user.pendingGames.forEach(gameId => {
              if (gameId === game.data._id) popularity++
            })
          })
          let avgRate = rate/usersWhoRated
          document.querySelector('#rating-number h2').innerText = avgRate
          document.querySelector('#popularity-number h2').innerText = popularity
        })
        .catch(err => console.log(err))

      // Game Genres
      const genreList = document.querySelector('#genres-list ul')
      game.data.genre.forEach(genre => {
        genreList.innerHTML += `
        <li>${genre}</li>
        `
      })

      // Game Platforms
      game.data.plattforms.forEach(plattform => {
        document.querySelector('#platforms-list ul').innerHTML += `
        <li>${plattform}</li>
        `

        // Game Release Date
        const date = new Date(game.data.releaseDate)
        document.getElementById('release-date-number').innerText = `${date.toLocaleDateString()}`
      })
    })
    .catch(err => console.log(err))
}

// Game Browser
axios
  .get('http://localhost:3000/api/games')
  .then(games => {
    games.data.forEach((game, i) => {
      document.getElementById('main-browser-results').innerHTML += `
      <option value="${game.name}" id="${game._id}"></option>
      `
      // if (i < 10) console.log(game.name)
    })
  })
  .catch(err => console.log(err))

// Search Button
document.getElementById('main-browser-btn').addEventListener('click', () => {
  const search = document.getElementById('main-browser').value
  axios
    .get('http://localhost:3000/api/games')
    .then(game => {
      window.location = `http://localhost:3000/game.html?game=${search}`
    })
    .catch(err => console.log(err))
})

// Home Button
document.getElementById('home-btn').addEventListener('click', () => {
  window.location = 'http://localhost:3000/index.html'
})

// Profile Button
document.getElementById('profile-btn').addEventListener('click', () => {
  window.location = 'http://localhost:3000/own.profile.html'
})

// Community Button
document.getElementById('community-btn').addEventListener('click', () => {
  window.location = 'http://localhost:3000/community.html'
})

// Log In Button
document.getElementById('login-btn').addEventListener('click', () => {
  axios.post('http://localhost:3000/api/auth/login', {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-pass').value
  })
  .then(response => {
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token)
      window.location.reload()
    } else {
      alert('Email or Password Wrong')
    }
  })
  .catch(err => {
    alert('Email or Password Wrong')
  })
})

// Sign Up Button
document.getElementById('signup-btn').addEventListener('click', () => {
  const pass = document.getElementById('signup-pass')
  const repeatedPass = document.getElementById('signup-repeated-pass')
  if (pass.value === repeatedPass.value) {

    pass.classList.remove('wrongPass')
    repeatedPass.classList.remove('wrongPass')

    axios.post('http://localhost:3000/api/auth/signup', {
      username: document.getElementById('signup-username').value,
      email: document.getElementById('signup-email').value,
      password: pass.value
    })
    .then(response => {
      localStorage.setItem('token', response.data.token)
      window.location.reload()
    })
    .catch(err => console.log(err))
  } else {
    pass.classList.add('wrongPass')
    repeatedPass.classList.add('wrongPass')
  }
})

// Log Out Button
document.getElementById('logout-btn').addEventListener('click', () => {
  window.localStorage.clear()
  window.location.reload()
})

// Add to Finished
document.getElementById('finished-button').addEventListener('click', () => {
  axios
    .get(`http://localhost:3000/api/games/${urlParams.get('game')}`)
    .then(game => {
      axios
        .post(`http://localhost:3000/api/users/me/finished/${game.data._id}`, {}, {
          headers: {
            token: localStorage.token
          }
        })
        .then(finishedList => {
          window.alert('Game added to the finished list')
          location.reload()
        })
        .catch(err => {
          window.alert('Something went wrong')
          console.log(err)
        })
    })
    .catch(err => console.log(err))
})

// Add to Pending
document.getElementById('pending-button').addEventListener('click', () => {
  axios
    .get(`http://localhost:3000/api/games/${urlParams.get('game')}`)
    .then(game => {
      axios
        .post(`http://localhost:3000/api/users/me/pending/${game.data._id}`, {}, {
          headers: {
            token: localStorage.token
          }
        })
        .then(pendingList => {
          window.alert('Game added to the pending list')
          location.reload()
        })
        .catch(err => {
          window.alert('Something went wrong')
          console.log(err)
        })
    })
    .catch(err => console.log(err))
})

// Add to Favourites
document.getElementById('favourites-button').addEventListener('click', () => {
  axios
    .get(`http://localhost:3000/api/games/${urlParams.get('game')}`)
    .then(game => {
      axios
        .post(`http://localhost:3000/api/users/me/favourites/${game.data._id}`, {}, {
          headers: {
            token: localStorage.token
          }
        })
        .then(resolve => {
          location.reload()
          console.log(resolve.data)
        })
        .catch(err => {
          window.alert('Something went wrong')
          console.log(err)
        })
    })
    .catch(err => console.log(err))
})

// Rate Modal button
document.getElementById('rate-modal-btn').addEventListener('click', () => {
  const score = document.getElementById('ex9').value
  const comment = document.getElementById('rate-comment').value
  
  axios
    .post(`http://localhost:3000/api/rates/me`, {
      game: globalGame._id,
      rate: score,
      comment: comment
    }, {
      headers: {
        token: localStorage.token
      }
    })
    .then(rate => {
      window.alert('Rate saved in database')
      location.reload()
    })
    .catch(err => console.log(err))
})