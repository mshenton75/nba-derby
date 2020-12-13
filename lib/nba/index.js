const axios = require('axios')

module.exports = {
  gamesForDate: async (date) => {
    const promise = new Promise((resolve, reject) => {
      const config = {
        headers: {
          'x-rapidapi-key': process.env.NBA_RAPID_API_KEY,
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
      }
      axios.get(`https://api-nba-v1.p.rapidapi.com/games/date/${date.format('YYYY-MM-DD')}`, config)
        .then((res) => {
          resolve(res.data.api.games)
        })
        .catch((err) => {
          console.error(err)
          reject(err.response.status, err.response.statusText)
        })
    })
    return promise
  },
  teamRoster: async (teamId) => {
    const promise = new Promise((resolve, reject) => {
      const config = {
        headers: {
          'x-rapidapi-key': process.env.NBA_RAPID_API_KEY,
          'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
        }
      }
      axios.get(`https://api-nba-v1.p.rapidapi.com/players/teamId/${teamId}?league=standard`, config)
        .then((res) => {
          resolve(res.data.api)
        })
        .catch((err) => {
          console.error(err)
          reject(err.response.status, err.response.statusText)
        })
    })
    return promise
  }
}
