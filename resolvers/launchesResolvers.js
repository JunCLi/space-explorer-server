module.exports = {
	Query: {
		async getAllLaunches(parent, { input }, { dataSources, req, app, postgres }) {
			return await dataSources.spaceXApi.getAllLaunches(input)
		},
	},
}