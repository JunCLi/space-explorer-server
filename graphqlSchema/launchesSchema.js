const { gql } = require('apollo-server-express')

module.exports = gql`

	scalar Date

	extend type Query {
		getAllLaunches(input: PaginationObject): [Launch!]
		getLaunch(flight_number: ID!): Launch!
		getBookedTrips(input: BookedTripPaginationObject): [BookedTrip!]
		getBookedTrip(input: BookedTripObject!): BookedTrip!
	}

	input PaginationObject {
		page: Int
		perPage: Int
	}

	input BookedTripPaginationObject {
		user_id: ID!
		page: Int
		perPage: Int
	}

	input BookedTripObject {
		user_id: ID!
		flight_number: ID!
	}

	type BookedTrip {
		bookingDetails: BookingDetails
		flightDetails: Launch
	}

	type BookingDetails {
		status: String
		date_added: Date
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
		cancelTrip(input: CancelTripObject!): Response!
	}
	
	input CancelTripObject {
		user_id: ID!
		flight_number: ID!
	}

	type BookTripResponse {
		message: String!
		getLaunch(id: ID!): Launch!
	}
`