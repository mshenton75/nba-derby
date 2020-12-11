require('../../config')
const axios = require('axios')
const querystring = require('querystring')
const mongoose = require('mongoose')
const Auth0Token = mongoose.model('Auth0Token')

module.exports = {
  registerUserId: async (auth0Id, dbId, recurse = true) => {
    const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0Id}`
    const data = {
      user_metadata: {
        user_id: dbId
      }
    }
    const config = {
      headers: {
        Authorization: `Bearer ${await Auth0Token.lastToken()}`,
        'Content-Type': 'application/json'
      }
    }

    axios.patch(url, data, config)
      .catch(async (err) => {
        console.error(err.response.status, err.response.statusText)
        if (err.response.status >= 400 && recurse) {
          await module.exports.createNewToken(() => {
            module.exports.registerUserId(auth0Id, dbId, false)
          })
        }
      })
  },
  createNewToken: async (res) => {
    const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`
    const config = { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
    const data = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_ADMIN_CLIENT_ID,
      client_secret: process.env.AUTH0_ADMIN_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
    })

    axios.post(url, data, config)
      .then((response) => {
        const token = new Auth0Token({ access_token: response.data.access_token })
        token.save(async (err, tok) => {
          if (err) return console.error(err)

          res()
        })
      })
      .catch((err) => {
        if (err) console.error(err.response.status, err.response.statusText)
      })
  }
}
