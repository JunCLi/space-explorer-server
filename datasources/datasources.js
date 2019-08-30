const UsersDB = require('./usersDB')
const SpaceXApi = require('./spaceXApi')
const TripsDB = require('./tripsDB')

const dataSources = () => ({
	usersDB: new UsersDB(),
	spaceXApi: new SpaceXApi(),
	tripsDB: new TripsDB(),
})

module.exports = dataSources