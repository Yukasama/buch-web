import https from 'https'
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/index.js'
import { GRAPHQL_ENDPOINT } from '~/config/graphql'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export const graphQLClient = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: GRAPHQL_ENDPOINT,
    fetchOptions: { agent },
  }),
  cache: new InMemoryCache(),
})
