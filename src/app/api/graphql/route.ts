import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from './schemas'
import { resolvers } from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
})

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    return {
      req,
      env: process.env,
    };
  },
})

export { handler as GET, handler as POST }
