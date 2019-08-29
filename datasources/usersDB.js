const { DataSource } = require('apollo-datasource')

const authenticate = require('../utils/authentication/authenticate')
const { encryptPassword, comparePassword } = require('../utils/DSHelperFunctions/bcryptFunctions')
const { createCookie, setCookie, retrieveCookie } = require('../utils/authentication/JWTCookie')
const { createInsertQuery, createUpdateQuery, createSelectQuery } = require('../utils/DSHelperFunctions/makeQueries')

class PlaceholderDatabase extends DataSource {
	constructor() {
		super()
	}

	initialize(config) {
		this.context = config.context
	}

	async signup(input) {
		try {
			let { email, password } = input
			email = email.toLowerCase()

			const checkDuplicateEmailColumns = [
				'email'
			]
			const checkDuplicateEmailQuery = createSelectQuery(checkDuplicateEmailColumns, 'space_explorer.users', 'email', email)
			const checkDuplicateEmailResult = await this.context.postgres.query(checkDuplicateEmailQuery)

			if (checkDuplicateEmailResult.rows.length) throw 'A user with this email already exists.'

			const hashedPassword = await encryptPassword(password)
			const insertUserObject = {
				...input,
				password: hashedPassword,
				email: email,
			}
			const insertUserQuery = createInsertQuery(insertUserObject, 'space_explorer.users')
			await this.context.postgres.query(insertUserQuery)

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}

	async login(input) {
		try {
			let { email, password } = input
			email = email.toLowerCase()

			const getUserColumns = [
				'id',
				'password',
			]
			const getUserQuery = createSelectQuery(getUserColumns, 'space_explorer.users', 'email', email)
			const getUserResult = await this.context.postgres.query(getUserQuery)
			if (!getUserResult.rows.length) throw "A user with this email doesn't exist"

			const { id: user_id, password: dbPassword } = getUserResult.rows[0]
			if (!await comparePassword(password, dbPassword)) throw 'Incorrect password'

			const tokenData = {
				user_id: user_id,
				email: email,
			}
			const myJWTToken = await createCookie(tokenData, 16)
			setCookie(myJWTToken, this.context.req.res)

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}

	async logout(input) {
		try {
			const jwtCookie = retrieveCookie(this.context.req)
			const { token, exp, iat } = jwtCookie
			const { user_id } = jwtCookie.data

			const blacklistJWTObject = {
				user_id: user_id,
				token: token,
				tokenIssued: iat,
				tokenExpiration: exp
			}

			const blacklistJWTQuery = createInsertQuery(blacklistJWTObject, 'space_explorer.blacklist_jwt')
			await this.context.postgres.query(blacklistJWTQuery)

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}

	async testAuthenticate(input) {
		try {
			const tokenData = await authenticate(this.context.req, 'space_explorer.blacklist_jwt', this.context.postgres)

			console.log(tokenData)

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}

}

module.exports = PlaceholderDatabase