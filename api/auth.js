require('../config')
const router = require('express').Router()
const passport = require('passport')
const querystring = require('querystring')
const userInteractor = require.main.require('./interactors/user_interactor.js')

require('dotenv').config()

// if app still in development, display placeholder
router.use((req, res, next) => {
  if (process.env.DISPLAY_PLACEHOLDER === 'true') {
    res.redirect('/')
  } else {
    next()
  }
})

router.get(
  '/login',
  passport.authenticate('auth0',
    { scope: 'openid email profile' }
  ),
  (req, res) => {
    res.redirect('/')
  }
)

router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user, info) => {
    if (err) return next(err)

    if (!user) return res.redirect('/login')

    req.logIn(user, (err) => {
      if (err) return next(err)

      userInteractor.searchUser({ id: req.user.id }, (user, next) => {
        if (!user) {
          const body = {
            email: req.user._json.email,
            username: req.user.nickname,
            first_name: req.user.name.givenName,
            last_name: req.user.name.familyName,
            auth0_id: req.user.id
          }
          userInteractor.createUser(body, (user) => {
            if (!user) {
              console.err('User failed to create')
              res.redirect('/login')
            }
          })
        }
      })

      const returnTo = req.session.returnTo
      delete req.session.returnTo
      res.redirect(returnTo || '/')
    })
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logOut()

  let returnTo = `${req.protocol}://${req.hostname}`
  const port = req.connection.localPort

  if (![undefined, 80, 443].includes(port)) {
    returnTo = process.env.NODE_ENV === 'production' ? `${returnTo}/` : `${returnTo}:${port}/`
  }

  const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`)
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_NBADERBY_CLIENT_ID,
    returnTo: returnTo
  })
  logoutURL.search = searchString

  res.redirect(logoutURL)
})

module.exports = router
