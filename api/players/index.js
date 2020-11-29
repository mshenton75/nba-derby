require('../../config')
const router = require('express').Router()
const _ = require('lodash')
const nba = require('nba')
const moment = require('moment')

router.get('/', async (req, res) => {
  // TODO: refactor into seperate object
  const ts = moment()
  const schedule = await nba.data.schedule(ts.year())
  const todaysGames = _.filter(schedule.league.standard, (data) => {
    return data.startDateEastern === ts.format('YYYYMMDD')
  })
  const players = await createPlayerList(todaysGames)
  const playerNames = _.map(players, 'player')
  res.send(playerNames)
})

async function createPlayerList (games) {
  const promises = games.map(g => getPlayersForGame(g))
  const players = await Promise.all(promises)
  return _.flatten(players)
}

async function getPlayersForGame (game) {
  const teams = [game.hTeam.teamId, game.vTeam.teamId]
  const promises = teams.map(t => nba.stats.commonTeamRoster({ TeamID: t }))
  const players = await Promise.all(promises)

  return _.flatMap(players, 'commonTeamRoster')
}

module.exports = router
