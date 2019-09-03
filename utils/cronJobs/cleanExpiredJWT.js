const cron = require('node-cron')


const postgres = require('../../config/postgres')
const { createSelectQuery, createDeleteQuery } = require('../DSHelperFunctions/makeQueries')

const getBlacklistedJWT = async () => {
	const checkJWTColumns = [
		'token',
		'token_expiration',
	]
	const checkJWTQuery = createSelectQuery(checkJWTColumns, 'space_explorer.blacklist_jwt')
	const blacklistedJWTs = await postgres.query(checkJWTQuery)

	return blacklistedJWTs.rows
}

const checkExpiredJWT = async () => {
	const blacklistedJWTs = await getBlacklistedJWT()

	return blacklistedJWTs.filter(blacklistedJWT => {
		return Date.now() < blacklistedJWT.token_expiration && blacklistedJWT
	})
}

const cleanExpiredJWT = async () => {
	const expiredJWTs = await checkExpiredJWT()

	expiredJWTs.forEach(async expiredJWT => {
		const deleteExpiredJWTQuery = createDeleteQuery('space_explorer.blacklist_jwt', 'token_expiration', expiredJWT.token_expiration)
		await postgres.query(deleteExpiredJWTQuery)
	})
}

cron.schedule('* * * * *', () => {
	console.log('Cleaned blacklisted JWTs on: ', Date.now())
	cleanExpiredJWT()
})