const passport = require('passport')
const LocalStratege = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStratege({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ where: { email } }) // 使用 where 查詢特定 email 的 user
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or Password incorrect.' })
          }
          return done(null, user)
        })
      })
      .catch(error => console.log(error))
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id) // 使用 findByPk() 查詢特定 id 的 user
      .then((user) => {
        user = user.toJSON() // 使用 toJSON() 把 user 物件轉成 plain object
        done(null, user)  // 回傳給 req 繼續使用
      }).catch(err => done(err, null))
  })
}
