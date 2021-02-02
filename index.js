process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
console.clear();

require('dotenv').config()

const express = require('express')

const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const router = require('./api/routers/router')


// MONGOOSE
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
  })

// ADD MIDDLEWARES AND ROUTES
const app = express()
  .use(cors())
  .use(morgan('dev'))
  .use(express.json())
  .use(express.static(path.join(__dirname, 'public')))
  .use('/api', router)

// Init server
const PORT = process.env.PORT || 2222
app.listen(PORT, (err) => {
  if (err) { throw new Error(err) }
  console.info('>'.repeat(40))
  console.info('💻  Reboot Server Live')
  console.info(`📡  PORT: http://localhost:${PORT}`)
  console.info('>'.repeat(40) + '\n')
})