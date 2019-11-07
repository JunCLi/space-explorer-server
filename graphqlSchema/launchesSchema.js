const { gql } = require('apollo-server-express')

module.exports = gql`

	scalar Date

	enum BookingStatus {
		BOOKED
		NOTBOOKED
		CANCELLED
	}

	extend type Query {
		getAllLaunches(input: CursorPaginationObject): LaunchesConnection!
		getLaunch(flight_number: ID!): Launch!
		getBookedTrips(input: BookedTripPaginationObject): BookedTripConnection!
		getCursorBookedTrips(input: CursorPaginationObject): CursorBookedTripConnection!
		getBookedTrip(flight_number: ID!): BookedTrip!
	}

	input CursorPaginationObject {
		cursor: String
		first: Int
	}

	input BookedTripPaginationObject {
		page: Int
		perPage: Int
	}

	input BookedTripObject {
		user_id: ID!
		flight_number: ID!
	}

	type BookedTripConnection {
		pageInfo: PageInfo
		bookedTrips: [BookedTrip!]
	}

	type BookedTrip {
		bookingDetails: BookingDetails
		flightDetails: Launch
	}

	type PageInfo {
		currentPage: Int!
		totalPages: Int!
	}

	type BookingDetails {
		status: BookingStatus!
		date_added: Date
	}

	type LaunchesConnection {
		nextCursor: String!
		hasMore: Boolean!
		launches: [Launch!]
	}

	type Launch {
		flight_number: ID
		rocket_id: ID
		rocket_name: String
		rocket_type: String
		details: String
		mission_name: String
		mission_patch: String
		mission_patch_small: String
	}

	type CursorBookedTripConnection {
		nextCursor: String
		hasMore: Boolean!
		bookedTrips: [BookedTrip!]
	}

	extend type Mutation {
		bookTrip(flight_number: ID): BookTripResponse!
		cancelTrip(flight_number: ID): Response!
	}

	type BookTripResponse {
		message: String!
		getLaunch(id: ID!): Launch!
	}
`