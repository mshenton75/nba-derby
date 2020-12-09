const axios = require('axios')

// TODO: handle token refresh
module.exports = {
  registerUserId: async (auth0Id, dbId) => {
    const url = `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${auth0Id}`
    const data = {
      user_metadata: {
        user_id: dbId
      }
    }
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.AUTH0_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
    axios.patch(url, data, config)
      .catch((err) => {
        console.error(err)
      })
  }
}
