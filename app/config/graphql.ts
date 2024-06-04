const isProduction = process.env.NODE_ENV === 'production'

export const GRAPHQL_ENDPOINT = isProduction
  ? 'https://ec2-3-71-108-167.eu-central-1.compute.amazonaws.com:3000/graphql'
  : 'https://localhost:3000/graphql'
