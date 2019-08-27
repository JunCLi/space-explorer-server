module.exports = {
  Mutation: {
		async placeholder(parent, { input }, { dataSources, req, app, postgres }){
			return await dataSources.placeholderDatabase.mutationPlaceholder('placeholder')
		},

		async placeholderApi(parent, { input }, { dataSources, req, app, postgres }){
			return await dataSources.placeholderApi.mutationPlaceholder('placeholder')
		},
  },
}



