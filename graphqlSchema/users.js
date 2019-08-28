const { gql } = require('apollo-server-express')

module.exports = gql`
  extend type Query {
    placeholder: QueryPlaceholder
		placeholderApi: QueryPlaceholder
  }

	type QueryPlaceholder {
		id: ID
	}

	extend type Mutation {
		signup(input: SignupObject!): Response!
		login(input: LoginObject!): Response!
		# logout(input: )
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

