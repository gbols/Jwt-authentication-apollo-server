const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema.js');
const { prisma } = require('./prisma-client/generated/prisma-client')
const resolvers = require('./resolvers');


const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context : req => ({
    prisma,
    req
  })
 });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
