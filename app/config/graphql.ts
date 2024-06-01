const isProduction = process.env.NODE_ENV === 'production'

export const GRAPHQL_ENDPOINT = isProduction
  ? 'ec2-3-75-197-52.eu-central-1.compute.amazonaws.com:3000/graphql'
  : 'https://localhost:3000/graphql'
