import { FetchResult, gql } from '@apollo/client/index.js'
import { graphQLClient } from '~/lib/apollo-client'
import { logger } from '~/lib/logger'
import { LoginResult } from '../graphql/__generated__/graphql'
import { handleGraphQlError } from './get-books'

export const loginKeycloak = async ({
  username,
  password,
}: {
  username?: string
  password?: string
}) => {
  logger.debug('login-keycloak: username=%s', username)
  logger.debug('login-keycloak: password=%s', password)

  if (!username || !password) {
    return
  }

  const mutation = gql`
    mutation ($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        access_token
      }
    }
  `
  try {
    const { data }: FetchResult<{ loginResult: LoginResult }[]> =
      await graphQLClient.mutate({
        mutation,
        variables: { username, password },
      })

    logger.debug('login-keycloak: data=%o', data)
    return data
  } catch (error) {
    handleGraphQlError(error)
    return
  }
}
