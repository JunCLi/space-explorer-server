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
		placeholder: MutationPlaceholder
		placeholderApi: MutationPlaceholder
	}

	type MutationPlaceholder {
		id: ID
	}
`

