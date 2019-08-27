const PlaceholderDatabase = require('./placeholderDatabase')
const PlaceholderApi = require('./placeholderApi')

const dataSources = () => ({
	placeholderDatabase: new PlaceholderDatabase(),
	placeholderApi: new PlaceholderApi(),
})

module.exports = dataSources