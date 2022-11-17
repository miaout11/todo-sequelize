// Include packages and define server related variables
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

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

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})