// Include packages and define server related variables
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = 3000

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting body-parser
app.use(express.urlencoded({ extended: true }))
// setting methodOverride
app.use(methodOverride('_method'))

// setting routes
app.get('/', (req, res) => {
  res.send(`<h1>hello world<h1>`)
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.create({ name, email, password })
    .then(user => res.render('/'))
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})