module.exports = {
	Query: {
		async getAllLaunches(parent, { input }, { dataSources, req, app, postgres }) {
			return await dataSources.spaceXApi.getAllLaunches(input)
		},

		async getLaunch(parent, input, { dataSources, req, app, postgres }) {
			return await dataSources.spaceXApi.getLaunch(input)
		},

		async getBookedTrips(parent, { input }, { dataSources, req, app, postgres }) {
			const bookedFlights = await dataSources.tripsDB.getBookedTrips(input)
			return await dataSources.spaceXApi.getLaunches(bookedFlights)
		},
	},

	Mutation: {
		async bookTrip(parent, input, { dataSources, req, app, postgres }) {
			return await dataSources.tripsDB.bookTrip(input)
		}
	}
}