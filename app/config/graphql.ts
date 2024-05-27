const isProduction = process.env.NODE_ENV === 'production'

export const GRAPHQL_ENDPOINT = isProduction
  ? 'https://buch.zenathra.com/graphql'
  : 'https://localhost:3000/graphql'
