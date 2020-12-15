const express = require('express')
const path = require('path')
require('dotenv').config()
const logger = require('morgan')
const app = express()
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const root = path.dirname(require.main.filename)
const expressSession = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
}

if (app.get('env') === 'production') {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true
}

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_NBADERBY_CLIENT_ID,
    clientSecret: process.env.AUTH0_NBADERBY_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API

     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile)
  }
)


// view engine setup
app.set('views', path.join(root, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', 1)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(root, 'public')))
app.use(helmet())
app.use(cors())

app.use(expressSession(session))

passport.use(strategy)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

require.main.require('./models/User.js')
require.main.require('./models/Auth0Token.js')
require.main.require('./models/ActivePlayer.js')

// must require tasks after models
require.main.require('./tasks')

module.exports = app
