const { RESTDataSource } = require('apollo-datasource-rest')

class SpaceXApi extends RESTDataSource {
	constructor() {
		super()
		this.baseURL = 'https://api.spacexdata.com/v3/'
	}

	async getAllLaunches(input) {
		try {
			const { page = 1, perPage = 10 } = input
	
			const launchesQueryData = await this.get(`launches?limit=${perPage}&offset=${(page - 1) * perPage}`)
	
			if (launchesQueryData.length === 0) throw 'no launches' 
			
			const launchesDetails = launchesQueryData.map(launch => (
				{
					flight_number: launch.flight_number,
					rocket_id: launch.rocket.rocket_id,
					rocket_name: launch.rocket.rocket_name,
					rocket_type: launch.rocket.rocket_type,
					mission_patch: launch.links.mission_patch,
					mission_patch_small: launch.links.mission_patch_small,
					mission_name: launch.mission_name,
				}
			))
	
			return launchesDetails
		} catch(err) {
			throw err
		}
	}
}

module.exports = SpaceXApi