const { RESTDataSource } = require('apollo-datasource-rest')

class SpaceXApi extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = 'https://api.spacexdata.com/v3/'
	}

	truncateLaunchDetail(launch) {
		const nullDetailsPlaceholder = `SpaceX has not provided any details for this flight so here is some lorem ipsum instead:\n\nFor those who have seen the Earth from space, and for the hundreds and perhaps thousands more who will, the experience most certainly changes your perspective. The things that we share in our world are far more valuable than those which divide us.\n\nIt suddenly struck me that that tiny pea, pretty and blue, was the Earth. I put up my thumb and shut one eye, and my thumb blotted out the planet Earth. I didn’t feel like a giant. I felt very, very small.\n\nScience has not yet mastered prophecy. We predict too much for the next year and yet far too little for the next 10.\n\nWe choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win.`

		return {
			flight_number: launch.flight_number,
			rocket_id: launch.rocket.rocket_id,
			rocket_name: launch.rocket.rocket_name,
			rocket_type: launch.rocket.rocket_type,
			details: launch.details ? launch.details : nullDetailsPlaceholder,
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

			const launchesQueryData = await this.get('launches?order')
			let launchesDetails = []

			if (!cursor) {
				const slicedLaunchesData = launchesQueryData.slice(0, first)
				launchesDetails = slicedLaunchesData.map(launch => this.truncateLaunchDetail(launch))
			} else {
				const startIndex = launchesQueryData.findIndex(launch => launch.flight_number === +cursor) + 1
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