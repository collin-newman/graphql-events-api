const server = require('./server');
server.listen(4000, () => {
  console.log('Listening on port 4000');
});
console.log('Running a GraphQL API server at localhost:4000/graphql');