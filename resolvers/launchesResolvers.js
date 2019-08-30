module.exports = {
	Query: {
		async getAllLaunches(parent, { input }, { dataSources, req, app, postgres }) {
			return await dataSources.spaceXApi.getAllLaunches(input)
		},

		async getLaunch(parent, input, { dataSources, req, app, postgres }) {
			return await dataSources.spaceXApi.getLaunch(input)
		},
	},

	Mutation: {
		async bookTrip(parent, input, { dataSources, req, app, postgres }) {
			return await dataSources.tripsDB.bookTrip(input)
		}
	}
}