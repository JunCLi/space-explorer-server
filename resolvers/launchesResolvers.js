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
			const flightsDetails = await dataSources.spaceXApi.getLaunches(bookedFlights.bookingDetails)

			return {
				pageInfo: bookedFlights.pageInfo,
				bookedTrips: bookedFlights.bookingDetails.map((flight, index) => (
					{ 
						bookingDetails: flight,
						flightDetails: flightsDetails[index]
					}
				))
			}
		},

		async getCursorBookedTrips(parent, { input }, { dataSources }) {
			const bookedFlights = await dataSources.tripsDB.getCursorBookedTrips(input)
			const flightDetails = await dataSources.spaceXApi.getLaunches(bookedFlights.bookingDetails)

			return {
				nextCursor: bookedFlights.nextCursor,
				hasMore: bookedFlights.hasMore,
				bookedTrips: bookedFlights.bookingDetails.map((flight, index) => (
					{
						bookingDetails: flight,
						flightDetails: flightDetails[index]
					}
				))
			}
		},

		async getBookedTrip(parent, input, { dataSources }) {
			const bookingResult = await dataSources.tripsDB.getBookedTrip(input)
			const flightDetails = await dataSources.spaceXApi.getLaunch(bookingResult)

			return {
				bookingDetails: bookingResult,
				flightDetails: flightDetails,
			}
		}
	},

	Mutation: {
		async bookTrip(parent, input, { dataSources }) {
			return await dataSources.tripsDB.bookTrip(input)
		},

		async cancelTrip(parent, input , { dataSources }) {
			return await dataSources.tripsDB.cancelTrip(input)
		}
	}
}

