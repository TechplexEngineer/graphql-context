const Schema = require('./schema.js');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const app = express();

app.get('/', function(req, res) {
  res.redirect('/graphql');
});

app.use('/graphql', graphqlHTTP({
	schema: Schema,
	graphiql: true
}));

app.listen(3500);

console.log('Go to http://localhost:3500/graphql to run queries!');