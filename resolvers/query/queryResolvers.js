module.exports = {
  Query: {
		async placeholder(parent, { input }, { dataSources, req, app, postgres }){
			return await dataSources.placeholderDatabase.queryPlaceholder('placeholder')
		},

		async placeholderApi(parent, { input }, { dataSources, req, app, postgres }){
			return await dataSources.placeholderApi.queryPlaceholder('placeholder Api')
		},
  },
}
