const { DataSource } = require('apollo-datasource')

const authenticate = require('../utils/authentication/authenticate')
const { createInsertQuery, createUpdateQuery, createSelectQuery, createSelectAndQuery } = require('../utils/DSHelperFunctions/makeQueries')

class TripsDB extends DataSource {
	constructor() {
		super()
	}

	initialize(config) {
		this.context = config.context
	}

	async queryBookTrip(input) {
		try {
			const { user_id, flight_number } = input
	
			const getBookedTripColumn = [
				'id',
				'flight_number',
				'status',
				'date_added',
			]
			const getBookedTripQuery = createSelectAndQuery(getBookedTripColumn, 'space_explorer.booked_trips', ['user_id', 'flight_number'], [user_id, flight_number])
			return await this.context.postgres.query(getBookedTripQuery)
		} catch(err) {
			throw err
		}
	}

	async bookTrip(input) {
		try {
			const { flight_number } = input
			const { user_id } = await authenticate(this.context.req, 'space_explorer.blacklist_jwt', this.context.postgres)

			const checkDuplicateColumns = [
				'id',
				'user_id',
				'flight_number',
				'status',
			]
			const checkDuplicateQuery = createSelectQuery(checkDuplicateColumns, 'space_explorer.booked_trips', 'user_id', user_id)
			const checkDuplicateResult = await this.context.postgres.query(checkDuplicateQuery)

			const duplicateFlight = checkDuplicateResult.rows.filter(flights => {
				return flights.flight_number.toString() === flight_number.toString() && flights.status
			})

			let edit = false
			if (duplicateFlight.length) {
				if (duplicateFlight[0].status === 'CANCELLED') {
					edit = true
				} else {
					throw 'duplicate flight'
				}
			}

			if (edit) {
				const updateBookTripObject = {
					status: 'BOOKED',
					last_modified: 'now()',
				}
				const updateBookTripQuery = createUpdateQuery(updateBookTripObject, 'space_explorer.booked_trips', 'id', duplicateFlight[0].id)
				await this.context.postgres.query(updateBookTripQuery)
			} else {
				const bookTripObject = {
					user_id: user_id,
					flight_number: flight_number,
					status: 'BOOKED'
				}
				const bookTripQuery = createInsertQuery(bookTripObject, 'space_explorer.booked_trips')
				await this.context.postgres.query(bookTripQuery)
			}

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}

	async getBookedTrips(input) {
		try {
			const { page = 1, perPage = 10 } = input
				? input
				: { page: 1, perPage: 10}
			const { user_id } = await authenticate(this.context.req, 'space_explorer.blacklist_jwt', this.context.postgres)
			
			const getBookedTripsColumns = [
				'flight_number',
				'status',
				'date_added',
			]
			const getBookedTripsQuery = createSelectQuery(getBookedTripsColumns, 'space_explorer.booked_trips', 'user_id', user_id)
			const getBookedTripsResult = await this.context.postgres.query(getBookedTripsQuery)
			
			const paginatedBookedTrips = getBookedTripsResult.rows.slice((page - 1) * perPage, perPage * page)

			if (!paginatedBookedTrips.length) throw 'no booked flights in range'

			const totalPages = Math.ceil(getBookedTripsResult.rows.length / perPage)

			return {
				pageInfo: {
					currentPage: page,
					totalPages: totalPages,
				},
				bookingDetails: paginatedBookedTrips,
			}
		} catch(err) {
			throw err
		}
	}

	async getCursorBookedTrips(input) {
		try {
			const { cursor, first = 10 } = input 
				? input
				: { first: 10 }
			const { user_id } = await authenticate(this.context.req, 'space_explorer.blacklist_jwt', this.context.postgres)

			const getBookedTripsColumns = [
				'flight_number',
				'status',
				'date_added',
			]
			const getBookedTripsQuery = createSelectQuery(getBookedTripsColumns, 'space_explorer.booked_trips', 'user_id', user_id)
			const getBookedTripsResult = await this.context.postgres.query(getBookedTripsQuery)
			let paginatedBookedTrips = []

			if (!cursor) {
				paginatedBookedTrips = getBookedTripsResult.rows.slice(0, first)
			} else {
				const startIndex = getBookedTripsResult.rows.findIndex(bookedTrip => bookedTrip.date_added.toString() === cursor) + 1
				const endIndex = startIndex + first
				paginatedBookedTrips = getBookedTripsResult.rows.slice(startIndex, endIndex)
			} 

			const nextCursor = paginatedBookedTrips.length
				? paginatedBookedTrips[paginatedBookedTrips.length - 1].date_added.toString()
				: null

			const hasMore = paginatedBookedTrips.length
				? paginatedBookedTrips[paginatedBookedTrips.length - 1].date_added.toString() !== getBookedTripsResult.rows[getBookedTripsResult.rows.length - 1].date_added.toString()
				: false 

			return {
				nextCursor: nextCursor,
				hasMore: hasMore,
				bookingDetails: paginatedBookedTrips.reverse(),
			}
		} catch(err) {
			throw err
		}
	}

	async getBookedTrip(input) {
		try {
			const { flight_number } = input
			const { user_id } = await authenticate(this.context.req, 'space_explorer.blacklist_jwt', this.context.postgres)
			const queryObject = {
				user_id: user_id,
				flight_number: flight_number
			}

			const getBookedTripResult = await this.queryBookTrip(queryObject)
			const bookingResult = getBookedTripResult.rows.length
				? getBookedTripResult.rows[0]
				: { flight_number: flight_number, status: 'NOTBOOKED'}

			return bookingResult
		} catch(err) {
			throw err
		}
	}

	async cancelTrip(input) {
		try {
			const { flight_number } = input
			const { user_id } = await authenticate(this.context.req, 'space_explorer.blacklist_jwt', this.context.postgres)
			const queryObject = {
				user_id: user_id,
				flight_number: flight_number,
			}

			const getBookedTripResult = await this.queryBookTrip(queryObject)
			
			if (!getBookedTripResult.rows.length) throw 'user has not booked this flight'
			const { id } = getBookedTripResult.rows[0]

			const updateBookTripObject = {
				status: 'CANCELLED',
				last_modified: 'now()',
			}
			const updateBookTripQuery = createUpdateQuery(updateBookTripObject, 'space_explorer.booked_trips', 'id', id)
			await this.context.postgres.query(updateBookTripQuery)

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}
}
 
module.exports = TripsDB