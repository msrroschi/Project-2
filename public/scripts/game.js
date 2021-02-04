const api = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000
})

const urlParams = localStorage.game
console.log(urlParams)

let globalGame = {}

window.onload = () => {

  // Check if logged
  if (window.localStorage.token) {
    document.getElementById('signup-navbar').style.display = "none"
    document.getElementById('login-navbar').style.display = "none"
    document.getElementById('logout-btn').style.display = "inline-block"
    document.getElementById('profile-btn').style.display = "inline-block"
  } else {
    document.getElementById('signup-navbar').style.display = "inline-block"
    document.getElementById('login-navbar').style.display = "inline-block"
    document.getElementById('logout-btn').style.display = "none"
    document.getElementById('profile-btn').style.display = "none"
  }

  api
    .get(`/games/${urlParams}`)
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
        console.log('entra en add button')
        api
          .get('/users/me', {
            headers: {
              token: localStorage.token
            }
          })
          .then(me => {
            console.log(me.data)
            const finishedIds = []
            me.data.finishedGames.forEach(game => finishedIds.push(game._id))
            const pendingIds = []
            me.data.pendingGames.forEach(game => pendingIds.push(game._id))
            const favouritesIds = []
            me.data.favouriteGames.forEach(game => favouritesIds.push(game._id))
            
            if (finishedIds.includes(game.data._id)) {
              document.getElementById('finished-button').classList.remove('btn-outline-dark')
              document.getElementById('finished-button').classList.add('btn-dark')
            }
            if (pendingIds.includes(game.data._id)) {
              document.getElementById('pending-button').classList.remove('btn-outline-dark')
              document.getElementById('pending-button').classList.add('btn-dark')
            }
            if (favouritesIds.includes(game.data._id)) {
              document.getElementById('favourites-button').classList.remove('btn-outline-dark')
              document.getElementById('favourites-button').classList.add('btn-dark')
            }
          })
          .catch(err => console.log(err))
      }

      // Game Rating and Popularity
      api
        .get('/users')
        .then(users => {
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
            user.finishedGames.forEach(gameId => {
              if (gameId === game.data._id) popularity++
            })
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
api
  .get('/games')
  .then(games => {
    games.data.forEach((game, i) => {
      document.getElementById('main-browser-results').innerHTML += `
      <option value="${game.name}" id="${game._id}"></option>
      `
      if (i < 10) console.log(game.name)
    })
  })
  .catch(err => console.log(err))

// Search Button
document.getElementById('main-browser-btn').addEventListener('click', () => {
  const search = document.getElementById('main-browser').value
  localStorage.removeItem('game')
  localStorage.setItem('game', search)
  window.location.href = 'game.html'
})

// Home Button
document.getElementById('home-btn').addEventListener('click', () => {
  localStorage.removeItem('game')
  window.location.href = 'index.html'
})

// Profile Button
document.getElementById('profile-btn').addEventListener('click', () => {
  localStorage.removeItem('game')
  window.location.href='own.profile.html'
})

// Community Button
document.getElementById('community-btn').addEventListener('click', () => {
  localStorage.removeItem('game')
  window.location.href='community.html'
})

// Log In Button
document.getElementById('login-btn').addEventListener('click', () => {
  api
    .post('/auth/login', {
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

    api.post('/auth/signup', {
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
  window.localStorage.removeItem('token')
  window.location.reload()
})

// Add to Finished
document.getElementById('finished-button').addEventListener('click', () => {
  api
    .get(`/games/${urlParams}`)
    .then(game => {
      api
        .post(`/users/me/finished/${game.data._id}`, {}, {
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
  api
    .get(`/games/${urlParams}`)
    .then(game => {
      api
        .post(`/users/me/pending/${game.data._id}`, {}, {
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
  api
    .get(`/games/${urlParams}`)
    .then(game => {
      api
        .post(`/users/me/favourites/${game.data._id}`, {}, {
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
  
  api
    .post(`/rates/me`, {
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