const userResovlers = require('./usersResolvers')
const launchesResolvers = require('./launchesResolvers')

module.exports = () => {
  return {
		...userResovlers,
		...launchesResolvers,
  }
}
