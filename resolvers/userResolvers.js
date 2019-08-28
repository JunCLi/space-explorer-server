module.exports = {
	Mutation: {
		async signup(parent, { input }, { dataSources, req, app, postgres }) {
			return await dataSources.usersDB.signup(input)
		},

		async login(parent, { input }, { dataSources, req, app, postgres }) {
			return await dataSources.usersDB.login(input)
		}
	},

	Query: {

	}
}