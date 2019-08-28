const { DataSource } = require('apollo-datasource')

const authenticate = require('../utils/DSHelperFunctions/authenticate')
const { encryptPassword, comparePassword } = require('../utils/DSHelperFunctions/bcryptFunctions')
const { createCookie, setCookie } = require('../utils/DSHelperFunctions/setCookie')
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
				'password'
			]
			const getUserQuery = createSelectQuery(getUserColumns, 'space_explorer.users', 'email', email)
			const getUserResult = await this.context.postgres.query(getUserQuery)
			if (!getUserResult.rows.length) throw "A user with this email doesn't exist"

			const dbPassword = getUserResult.rows[0].password
			if (!await comparePassword(password, dbPassword)) throw 'Incorrect password'

			const myJWTToken = await createCookie(email, 16)
			console.log(myJWTToken)
			setCookie('space_explorer_app', myJWTToken, this.context.req.res)

			return { message: 'success' }
		} catch(err) {
			throw err
		}
	}
}

module.exports = PlaceholderDatabase