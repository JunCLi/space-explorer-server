const { gql } = require('apollo-server-express')

module.exports = gql`

	scalar Date

	extend type Query {
		getAllLaunches(input: Pagination): [Launch!]
		getLaunch(id: ID!): Launch!
		getBookedTrips(input: BookedTripPagination): [Launch!]
		getBookedTrip(user_id: ID!): Launch!
	}

	input Pagination {
		page: Int
		perPage: Int
	}

	input BookedTripPagination {
		user_id: ID!
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

	extend type Mutation {
		bookTrip(flight_number: ID): BookTripResponse!
	}
	
	type BookTripResponse {
		message: String!
		getLaunch(id: ID!): Launch!
	}
`