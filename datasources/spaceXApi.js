const { RESTDataSource } = require('apollo-datasource-rest')

class SpaceXApi extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = 'https://api.spacexdata.com/v3/'
	}

	truncateLaunchDetail(launch) {
		return {
			flight_number: launch.flight_number,
			rocket_id: launch.rocket.rocket_id,
			rocket_name: launch.rocket.rocket_name,
			rocket_type: launch.rocket.rocket_type,
			mission_name: launch.mission_name,
			mission_patch: launch.links.mission_patch,
			mission_patch_small: launch.links.mission_patch_small,
		}
	}

	async getAllLaunches(input) {
		try {
			const { cursor, first = 10 } = input
				? input
				: { first: 10 }

			const launchesQueryData = await this.get('launches?order=desc')
			let launchesDetails = []

			if (!cursor) {
				const slicedLaunchesData = launchesQueryData.slice(0, first)
				launchesDetails = slicedLaunchesData.map(launch => this.truncateLaunchDetail(launch))
			} else {
				const startIndex = launchesQueryData.findIndex(launch => launch.flight_number === +cursor - 1)
				const endIndex = startIndex + first		
				const slicedLaunchesData = launchesQueryData.slice(startIndex, endIndex)
				launchesDetails = slicedLaunchesData.map(launch => this.truncateLaunchDetail(launch))
			}
			
			const nextCursor = launchesDetails.length
				? launchesDetails[launchesDetails.length - 1].flight_number
				: null

			const hasMore = launchesDetails.length
				? launchesDetails[launchesDetails.length - 1].flight_number !== launchesQueryData[launchesQueryData.length - 1].flight_number
				: false

			return {
				nextCursor: nextCursor,
				hasMore: hasMore,
				launches: launchesDetails,
			}			
		} catch(err) {
			throw err
		}
	}

	async getLaunch(input) {
		try {
			const { flight_number } = input
			const launchQueryData = await this.get(`launches/${flight_number}`)
			const launchDetails = this.truncateLaunchDetail(launchQueryData)

			return launchDetails
		} catch(err) {
			throw err
		}
	}

	async getLaunches(bookedTrips) {
		try {
			const launchesQuery = await Promise.all(bookedTrips.map(async bookedTrip => 
				this.get(`launches/${bookedTrip.flight_number}`)
			))
			const launchesDetails = launchesQuery.map(launch => this.truncateLaunchDetail(launch))

			return launchesDetails
		} catch(err) {
			throw err
		}
	}
}

module.exports = SpaceXApi