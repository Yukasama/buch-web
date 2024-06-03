import { gql } from '@apollo/client/index.js'
import { graphQLClient } from '~/lib/apollo-client'
import { GraphQLError } from 'graphql'

export const loginKeycloak = async () => {
  const mutation = gql`
    mutation ($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        access_token
      }
    }
  `
  try {
    const { access_token }: { data: { access_token: LoginResult }[] } =
      await graphQLClient.mutate({
        mutation,
      })
    return data.map((book) => book)
  } catch (error) {
    handleGraphQlError(error)
    return []
  }
}
