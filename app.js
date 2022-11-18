// Include packages and define server related variables
const express = require('express')
const session = require('express-session')
const passport = require('passport') // 暫時設定，為了驗證登入狀態
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const PORT = 3000
// 載入passport 設定檔要寫在 express-session 後面
const usePassport = require('./config/passport')

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// setting session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
// setting body-parser
app.use(express.urlencoded({ extended: true }))
// setting methodOverride
app.use(methodOverride('_method'))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// setting routes
app.get('/', (req, res) => {
  // 查詢多筆資料是 findAll()，如果不帶參數，會預設撈出整張表的資料
  return Todo.findAll({
    // 把資料轉換成單純 JS 物件，需要將這包參數{ raw: true, nest: true}傳給 findAll()，才能在樣板裡使用資料
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findByPk(id)
    // 把資料轉換成 plain object 的方法，只需要直接在傳入樣板前加上 toJSON()
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 查詢多筆資料：要在 findAll({ raw: true, nest: true}) 直接傳入參數
// 查詢單筆資料：要在 res.render 時在物件實例 todo 後串上 todo.toJSON()。

app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  // MySQL 會使用 WHERE 來加入條件語句，在 Sequelize 裡，就會變成在參數裡加上 where，可以根據我們指令的條件(這裡是email)來尋找(user是否已存在)資料。
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        console.log('User already exists!')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
          name,
          email,
          password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})