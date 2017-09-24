const {
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
} = require('graphql');

const PersonType = new GraphQLObjectType({
	name: 'VirtualMachine',
	description: 'Somebody that you used to know',
	fields: () => ({
		name: {
			type: GraphQLString,
			resolve: (root, args) => root.name,
		},
		height: {
			type: GraphQLString,
			resolve: (root, args) => root.height,
		},
		mass: {
			type: GraphQLString,
			resolve: (root, args, ctx) => root.mass,
		}
	}),
});

const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'The root of all... queries',
	fields: () => ({

		people: {
			type: new GraphQLList(PersonType),
			resolve:  (root, args, fetch) => {
				return fetch(`/people`, 'results');
			}
		}
	}),
});

module.exports = new GraphQLSchema({
	query: QueryType,
});