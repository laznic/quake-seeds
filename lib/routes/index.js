'use strict'

const Battlefy = require('./api/battlefy')
const Players = require('./api/players')
const Teams = require('./api/teams')
const SeedsAPI = require('./api/seeds')
const TDM = require('./web/2v2')
const About = require('./web/about')
const Home = require('./web/index')
const SeedsWeb = require('./web/seeds')
const Static = require('./web/static')

module.exports = [
  Home,
  Static,
  About,
  TDM,
  SeedsWeb,
  Battlefy,
  Players,
  Teams,
  SeedsAPI
]
