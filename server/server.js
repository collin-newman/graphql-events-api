const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const server = express();
server.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

module.exports = server;