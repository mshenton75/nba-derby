const _ = require('lodash')
const nbaClient = require('../nba')
const moment = require('moment')

class PlayersList {
  constructor (date) {
    this.date = date
  }

  async getList () {
    // NBA API stores games as UTC, so we need to get games for today with status == scheduled
    // and games for tomorrow that have early UTC start times
    const getGames = async (date) => {
      const games = await nbaClient.gamesForDate(date.clone())
      games.push(...(await nbaClient.gamesForDate(date.clone().add(1, 'days'))))
      const cutOffTime = date.clone().add(24, 'hours')

      return _.filter(games, (g) => {
        // game start time is in next 24 hours
        return g.startTimeUTC < cutOffTime && g.statusGame === 'Scheduled'
      })
    }

    // players list by game
    const createPlayerList = async (games) => {
      const promises = games.map(g => getPlayersForGame(g))
      return await Promise.all(promises)
    }

    // TODO: potential to hit 30 requests / min rate limit . . . build in sleep mechanism
    const getPlayersForGame = async (game) => {
      const teams = [game.hTeam.teamId, game.vTeam.teamId]
      const promises = teams.map(teamId => nbaClient.teamRoster(teamId))
      const rosters = await Promise.all(promises)
      return { game_id: game.gameId, rosters: serializePlayers(rosters, game.hTeam, game.vTeam) }
    }

    // flat map player arrays, while filtering out G league players
    // and extracting relevant attributes
    const serializePlayers = (rosters, homeTeam, awayTeam) => {
      const players = []
      _.forEach(rosters, (r) => {
        _.forEach(r.players, (player) => {
          if ('standard' in player.leagues) {
            const playerObj = {
              first_name: player.firstName,
              last_name: player.lastName,
              team_id: player.teamId,
              player_id: player.playerId,
              position: player.leagues.standard.pos,
              team_name: player.teamId === homeTeam.teamId ? homeTeam.fullName : awayTeam.fullName
            }
            players.push(playerObj)
          }
        })
      })
      return players
    }

    return await createPlayerList(await getGames(this.date))
  }
}

module.exports = PlayersList
