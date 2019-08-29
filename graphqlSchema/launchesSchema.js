const { gql } = require('apollo-server-express')

module.exports = gql`
	extend type Query {
		getAllLaunches(input: pagination): [Launch!]
		getLaunch(id: ID!): Launch
	}

	input pagination {
		page: Int
		perPage: Int
	}

	type Launch {
		flight_number: ID
		rocket_id: ID
		rocket_name: String
		rocket_type: String
		mission_name: String
		mission_patch: String
		mission_patch_small: String
	}
`