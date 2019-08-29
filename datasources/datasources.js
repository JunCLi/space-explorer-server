const UsersDB = require('./usersDB')
const SpaceXApi = require('./spaceXApi')

const dataSources = () => ({
	usersDB: new UsersDB(),
	spaceXApi: new SpaceXApi(),
})

module.exports = dataSources