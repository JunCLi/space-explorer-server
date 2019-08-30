const userResovlers = require('./usersResolvers')
const launchesResolvers = require('./launchesResolvers')

module.exports = () => {
  return {
		Mutation: {
			...userResovlers.Mutation,
			...launchesResolvers.Mutation,
		},
		Query: {
			...userResovlers.Query,
			...launchesResolvers.Query,
		}
  }
}