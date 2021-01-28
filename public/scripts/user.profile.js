window.onload = function() {

  const userId = localStorage.userId
  console.log(userId)
  localStorage.removeItem('userId')

  // Check if logged
  if (window.localStorage.token) {
    document.getElementById('signup-navbar').style.display = 'none'
    document.getElementById('login-navbar').style.display = 'none'
    document.getElementById('logout-btn').style.display = 'inline-block'
  } else {
    document.getElementById('signup-navbar').style.display = 'inline-block'
    document.getElementById('login-navbar').style.display = 'inline-block'
    document.getElementById('logout-btn').style.display = 'none'
  }

  axios.get(`http://localhost:3000/api/users/${userId}`, {
    headers: {
      token: localStorage.token
    }
  })
    .then(user => {
      console.log(document.title, user)
      document.title = user.data.username + ' Profile'
    })
    .catch(err => {console.log(err)})
}



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

// Home Button
document.getElementById('home-btn').addEventListener('click', () => {
  window.location = 'http://localhost:3000/index.html'
})

// Community Button
document.getElementById('community-btn').addEventListener('click', () => {
  window.location = 'http://localhost:3000/community.html'
})

// Log Out Button
document.getElementById('logout-btn').addEventListener('click', () => {
  window.localStorage.clear()
  window.location.reload()
})