const Schema = require('./schema.js');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const app = express();

app.get('/', function(req, res) {
  res.redirect('/graphql');
});

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

app.get('/graphql', graphqlHTTP({
	schema: Schema,
	graphiql: true,
}));

app.post('/graphql', (req, res) => {
	let ret = graphqlHTTP({
		schema: Schema,
		context: fetchResponseByURL
	})
	return ret(req, res);
});

app.listen(3500);

console.log('Go to http://localhost:3500/graphql to run queries!');