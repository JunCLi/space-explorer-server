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
			const { page = 1, perPage = 10 } = input
	
			const launchesQueryData = await this.get(`launches?limit=${perPage}&offset=${(page - 1) * perPage}`)
	
			if (launchesQueryData.length === 0) throw 'no launches in range' 
			
			const launchesDetails = launchesQueryData.map(launch => (
				this.truncateLaunchDetail(launch)
			))
	
			return launchesDetails
		} catch(err) {
			throw err
		}
	}

	async getLaunch(input) {
		try {
			const { id } = input
			const launchQueryData = await this.get(`launches/${id}`)
			const launchDetails = this.truncateLaunchDetail(launchQueryData)

			return launchDetails
		} catch(err) {
			throw err
		}
	}
}

module.exports = SpaceXApi