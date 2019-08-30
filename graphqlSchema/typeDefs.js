const rootSchema = require('./rootSchema')

const users = require('./usersSchema')
const launches = require('./launchesSchema')

const schemaArray = [rootSchema, users, launches]

module.exports = schemaArray