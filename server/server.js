// require express and path
const express = require('express');
const path = require('path');
// require connection file
const db = require('./config/connection');
// require apolloserver from apollo-server-express
const { ApolloServer } = require('apollo-server-express');
// require typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
// require authMiddleware from auth
const { authMiddleware } = require('./utils/auth');
// define server with typeDefs, resolvers, and context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})
// define app and port
const app = express();
const PORT = process.env.PORT || 3001;
// express middleware function to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// if in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// defines a route for the server to use
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/'));
})
// function to start the server
const startApolloServer = async (typeDefs, resolvers) => {
  // create a new Apollo server and pass in schema data
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });
  // start the API server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
      console.log (
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};
// executes startApolloServer function
startApolloServer(typeDefs, resolvers);