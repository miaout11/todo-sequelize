// Include packages and define server related variables
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config() // 使用.env
}

const db = require('./models')
const Todo = db.Todo
const User = db.User

const routes = require('./routes')
// 載入passport 設定檔要寫在 express-session 後面
const usePassport = require('./config/passport')

const app = express()
const PORT = process.env.PORT

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
// setting body-parser
app.use(express.urlencoded({ extended: true }))
// setting methodOverride
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// use connect-flash
app.use(flash())

// 放在res.locals的資料，讓 view 可以存取
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// setting routes
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})