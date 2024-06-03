const isProduction = process.env.NODE_ENV === 'production'

export const GRAPHQL_ENDPOINT = isProduction
  ? 'https://ec2-18-153-49-213.eu-central-1.compute.amazonaws.com:3000/graphql'
  : 'https://localhost:3000/graphql'
