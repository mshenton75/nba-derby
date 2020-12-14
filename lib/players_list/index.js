const _ = require('lodash')
const nbaClient = require('../nba')

class PlayersList {
  constructor (date) {
    this.date = date
  }

  async getList () {
    const createPlayerList = async (games) => {
      const promises = games.map(g => getPlayersForGame(g))
      const players = await Promise.all(promises)
      return _.flatten(players)
    }

    // TODO: potential to hit 30 requests / min rate limit . . . built in sleep mechanism
    const getPlayersForGame = async (game) => {
      const teams = [game.hTeam.teamId, game.vTeam.teamId]
      const promises = teams.map(teamId => nbaClient.teamRoster(teamId))
      const rosters = await Promise.all(promises)
      return serializePlayers(rosters)
    }

    // flat map player arrays, while filtering out G league players
    // and extracting relevant attributes
    const serializePlayers = (rosters) => {
      const players = []
      _.forEach(rosters, (r) => {
        _.forEach(r.players, (player) => {
          if ('standard' in player.leagues) {
            players.push(`${player.firstName} ${player.lastName}`)
          }
        })
      })
      return players
    }

    const games = await nbaClient.gamesForDate(this.date)
    return await createPlayerList(games)
  }
}

module.exports = PlayersList
