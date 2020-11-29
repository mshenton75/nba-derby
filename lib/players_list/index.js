const _ = require('lodash')
const nba = require('nba')

class PlayersList {
  constructor (date) {
    this.date = date
  }

  async getList () {
    const createPlayerList = async function (games) {
      const promises = games.map(g => getPlayersForGame(g))
      const players = await Promise.all(promises)
      return _.flatten(players)
    }

    const getPlayersForGame = async function (game) {
      const teams = [game.hTeam.teamId, game.vTeam.teamId]
      const promises = teams.map(t => nba.stats.commonTeamRoster({ TeamID: t }))
      const players = await Promise.all(promises)
      // TODO: raise exception, add timeout
        .catch(e => console.log(e.message))
      return _.flatMap(players, 'commonTeamRoster')
    }

    const schedule = await nba.data.schedule(this.date.year())
    const todaysGames = _.filter(schedule.league.standard, (data) => {
      return data.startDateEastern === this.date.format('YYYYMMDD')
    })
    const players = await createPlayerList(todaysGames)
    return _.map(players, 'player')
  }
}

module.exports = PlayersList
