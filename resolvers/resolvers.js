const userResovlers = require('./userResolvers')

module.exports = () => {
  return {
		...userResovlers
  }
}
