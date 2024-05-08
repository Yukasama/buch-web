import { gql } from '@apollo/client/index.js'
import { graphQLClient } from '~/lib/apollo-client'
import type { Buch } from '~/graphql/__generated__/graphql'
import { logger } from '~/lib/logger'
import { GraphQLError } from 'graphql'

export const getAllBooks = async () => {
  logger.debug('getAllBooks (attempt)')

  const query = gql`
    query {
      buch {
        isbn
        rating
        titel {
          titel
        }
      }
    }
  `
  try {
    const { data } = await graphQLClient.query({ query })
    logger.debug('getAllBooks (success)')
    return data as Buch[]
  } catch (error) {
    handleGraphQlError(error)
    return []
  }
}

export const getBookById = async ({ id }: { id?: string }) => {
  logger.debug('getBookById: id=%s', id)

  if (!id) {
    return undefined
  }

  const query = gql`
    query ($id: ID!) {
      buch(id: $id) {
        isbn
        rating
        titel {
          titel
        }
      }
    }
  `
  try {
    const { data } = await graphQLClient.query({ query, variables: { id } })
    logger.debug('getBookById: data=%o', data)
    return data.buch as Buch
  } catch (error) {
    handleGraphQlError(error)
    return undefined
  }
}

const handleGraphQlError = (error: unknown) => {
  if (error instanceof GraphQLError) {
    logger.error(
      'handleGraphQlError: message=%s, locations=%o, path=%o',
      error.message,
      error.locations,
      error.path,
    )
  } else {
    logger.error('handleGraphQlError: error=%s', error)
  }
}
