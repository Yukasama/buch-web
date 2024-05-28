const isProduction = process.env.NODE_ENV === 'production'

export const GRAPHQL_ENDPOINT = isProduction
  ? 'https://alien-obliging-explicitly.ngrok-free.app/graphql'
  : 'https://localhost:3000/graphql'
