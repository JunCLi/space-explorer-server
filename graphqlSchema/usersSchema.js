const { gql } = require('apollo-server-express')

module.exports = gql`
	type QueryPlaceholder {
		id: ID
	}

	extend type Mutation {
		signup(input: SignupObject!): Response!
		login(input: LoginObject!): Response!
		logout: Response!
		testAuthenticate: Response!
	}

	input SignupObject {
		email: String!
		password: String!
		firstName: String!
		lastName: String!
	}

	input LoginObject {
		email: String!
		password: String!
	}

	type Response {
		message: String!
	}

`

