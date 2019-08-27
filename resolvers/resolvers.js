const queryResolvers = require('./query/queryResolvers')
const mutationResolvers = require('./mutation/mutationResolvers')

module.exports = () => {
  return {
    ...queryResolvers,
    ...mutationResolvers,
  }
}
