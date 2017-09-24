const {
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLBoolean,
	GraphQLInt,
} = require('graphql');

const rp = require('request-promise');
const _ = require('lodash');
const DataLoader = require('dataloader');
const BASE_URL = 'https://swapi.co/api'; //no trailing /

// Use dataloader to batch URL requests for each layer of the query
const restLoader = new DataLoader((urls) => {
	console.log("load", urls);
	return Promise.all(urls.map((url) => {
		return rp({
			uri: url,
			json: true,
		});
	}));
});

function fetchResponseByURL(relativeURL, elem) {
	console.log(`${BASE_URL}${relativeURL}`);
	return restLoader.load(`${BASE_URL}${relativeURL}`).then((res) => {
		if (elem) {
			return _.get(res, elem);
		}
		return res;
	});
}


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
			resolve: (root, args) => root.mass,
		}
	}),
});

const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'The root of all... queries',
	fields: () => ({

		people: {
			type: new GraphQLList(PersonType),
			resolve:  (root, args) => fetchResponseByURL(`/people`, 'results')
		}
	}),
});

module.exports = new GraphQLSchema({
	query: QueryType,
});