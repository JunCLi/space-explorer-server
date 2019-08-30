const { DataSource } = require('apollo-datasource')

const authenticate = require('../utils/authentication/authenticate')
const { createInsertQuery, createUpdateQuery, createSelectQuery } = require('../utils/DSHelperFunctions/makeQueries')

class TripsDB extends DataSource {
	constructor() {
		super()
	}

	initialize(config) {
		this.context = config.context
	}

	async bookTrip(input) {
		try {
			const { flight_number } = input
			const { user_id } = await authenticate(this.context.req, 'space_explorer.blacklist_jwt', this.context.postgres)

			const checkDuplicateColumns = [
				'user_id',
				'flight_number',
			]
			const checkDuplicateQuery = createSelectQuery(checkDuplicateColumns, 'space_explorer.booked_trips', 'user_id', user_id)
			const checkDuplicateResult = await this.context.postgres.query(checkDuplicateQuery)
			const duplicateFlight = checkDuplicateResult.rows.filter(flights => {
				return flights.flight_number.toString() === flight_number.toString()
			})
			if (duplicateFlight.length) throw 'duplicate flight'
	
			const bookTripObject = {
				user_id: user_id,
				flight_number: flight_number,
				status: 'booked'
			}
			const bookTripQuery = createInsertQuery(bookTripObject, 'space_explorer.booked_trips')
			await this.context.postgres.query(bookTripQuery)

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}
}

module.exports = TripsDB