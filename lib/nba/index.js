const axios = require('axios')
const config = {
  headers: {
    'x-rapidapi-key': process.env.NBA_RAPID_API_KEY,
    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
  }
}
const baseUrl = 'https://api-nba-v1.p.rapidapi.com'

module.exports = {
  gamesForDate: async (date) => {
    const promise = new Promise((resolve, reject) => {
      axios.get(`${baseUrl}/games/date/${date.format('YYYY-MM-DD')}`, config)
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
      axios.get(`${baseUrl}/players/teamId/${teamId}`, config)
        .then((res) => {
          resolve(res.data.api)
        })
        .catch((err) => {
          console.error(err)
          reject(err.response.status, err.response.statusText)
        })
    })
    return promise
  },
  statsForGame: async (gameId) => {
    const promise = new Promise((resolve, reject) => {
      axios.get(`${baseUrl}/statistics/players/gameId/${gameId}`, config)
        .then((res) => {
          resolve(res.data.api.statistics)
        })
        .catch((err) => {
          console.error(err)
          reject(err.response.status, err.response.statusText)
        })
    })
    return promise
  }
}
