const _ = require('lodash')
const nbaClient = require('../nba')

class PlayersList {
  constructor (date) {
    this.date = date
  }

  async getList () {
    // NBA API stores games as UTC, so we need to get games for today with status == scheduled
    // and games for tomorrow that have early UTC start times
    const getGames = async (date) => {
      const games = await nbaClient.gamesForDate(date)
      games.push(...(await nbaClient.gamesForDate(date.add(1, 'days'))))
      return _.filter(games, (g) => {
        if (g.statusGame === 'Scheduled') return true

        // calculate 6 AM UTC next day as arbitrary cutoff to
        // collect games scheduled for today EST (early morning UTC)
        // but not next day EST
        const cutoffTime = date.utc().startOf('day').add(30, 'hours')
        return cutoffTime < g.startTimeUTC
      })
    }

    const createPlayerList = async (games) => {
      const promises = games.map(g => getPlayersForGame(g))
      const players = await Promise.all(promises)
      return _.flatten(players)
    }

    // TODO: potential to hit 30 requests / min rate limit . . . build in sleep mechanism
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

    return await createPlayerList(await getGames(this.date))
  }
}

module.exports = PlayersList
