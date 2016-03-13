var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , User = mongoose.model('User')


module.exports = function (passport, config) {
  // require('./initializer')

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      console.log(email)
      if(email.indexOf("@")!=-1){
        User.findOne({ email: email }, function (err, user) {
          if (err) { return done(err) }
          if (!user) {
            return done(null, false, { message: '该用户邮箱未注册！' })
          }
          if (!user.authenticate(password)) {
            return done(null, false, { message: '邮箱或者密码错误！' })
          }
          return done(null, user)
        })
      }else{
        User.findOne({ username: email }, function (err, user) {
          if (err) { return done(err) }
          if (!user) {
            return done(null, false, { message: '该用户名未注册！' })
          }
          if (!user.authenticate(password)) {
            return done(null, false, { message: '用户名或者密码错误！' })
          }
          return done(null, user)
        })
      }
      
    }
  ))

}
