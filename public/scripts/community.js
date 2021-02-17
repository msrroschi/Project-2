const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  // baseURL: 'https://tyg-app.herokuapp.com/api',
  timeout: 2000
})

window.onload = function() {

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

  function generateCommunity(users, me) {
    users.forEach((user, i) => {
      if (!(localStorage.token && user._id === me._id)) {
        let userHtml = document.createElement('div')
        userHtml.classList.add('container')
        userHtml.innerHTML = 
        `<ul class="list-group list-group-horizontal">
          <li class="list-group-item col-6">${user.username}</li>
          <li class="list-group-item col-6">
            <button type="button" class="btn btn-primary" id="viewProfile${i}">View Profile</button>
          </li>
        </ul>`
        
        document.body.appendChild(userHtml)
        
        document.getElementById(`viewProfile${i}`).addEventListener('click', () => {
          if (localStorage.token) {
            localStorage.setItem('userId', user._id)
            window.location.href = 'user.profile.html'
          } else {
            window.alert('You have to be logged in')
          }
        })
      }
    })
  }

  // Muestra todos los usuarios
  api
    .get('/users')
    .then(users => {
      api
        .get('/users/me', {
          headers: {
            token: localStorage.token
          }
        })
        .then(me => generateCommunity(users.data, me.data))})
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
  window.location.href = 'index.html'
})

// Profile Button
document.getElementById('profile-btn').addEventListener('click', () => {
  window.location.href = 'own.profile.html'
})

// Community Button
document.getElementById('community-btn').addEventListener('click', () => {
  window.location.reload()
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

    api
      .post('/auth/signup', {
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