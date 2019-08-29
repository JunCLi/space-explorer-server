const userResovlers = require('./usersResolvers')

module.exports = () => {
  return {
		...userResovlers
  }
}
