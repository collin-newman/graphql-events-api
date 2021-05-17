const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const cors = require('cors');

const server = express();
server.use(cors());
server.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

module.exports = server;