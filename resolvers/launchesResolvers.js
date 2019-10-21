module.exports = {
	Query: {
		async getAllLaunches(parent, { input }, { dataSources }) {
			return await dataSources.spaceXApi.getAllLaunches(input)
		},

		async getLaunch(parent, input, { dataSources }) {
			return await dataSources.spaceXApi.getLaunch(input)
		},

		async getBookedTrips(parent, { input }, { dataSources }) {
			const bookedFlights = await dataSources.tripsDB.getBookedTrips(input)
			const flightsDetails = await dataSources.spaceXApi.getLaunches(bookedFlights)

			return bookedFlights.map((flight, index) => (
				{ 
					bookingDetails: flight,
					flightDetails: flightsDetails[index]
				}
			))
		},

		async getBookedTrip(parent, { input }, { dataSources }) {
			const bookedFlight = await dataSources.tripsDB.getBookedTrip(input)
			const flightDetails = await dataSources.spaceXApi.getLaunch(bookedFlight)

			return {
				bookingDetails: bookedFlight,
				flightDetails: flightDetails,
			}
		}
	},

	Mutation: {
		async bookTrip(parent, input, { dataSources }) {
			return await dataSources.tripsDB.bookTrip(input)
		},

		async cancelTrip(parent, { input }, { dataSources }) {
			return await dataSources.tripsDB.cancelTrip(input)
		}
	}
}