import { gql } from '@apollo/client/index.js'
import { graphQLClient } from '~/lib/apollo-client'
import { logger } from '~/lib/logger'
import type { Buch } from '~/graphql/__generated__/graphql'
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
    const { data }: { data: { buch: Buch }[] } = await graphQLClient.query({
      query,
    })
    logger.debug('getAllBooks (success)')
    return data.map((book) => book)
  } catch (error) {
    handleGraphQlError(error)
    return []
  }
}

export const getBookById = async ({ id }: { id?: string }) => {
  logger.debug('getBookById: id=%s', id)

  if (!id) {
    return
  }

  const query = gql`
    query ($id: ID!) {
      buch(id: $id) {
        isbn
        rating
        preis
        rabatt
        art
        lieferbar
        homepage
        titel {
          titel
          untertitel
        }
      }
    }
  `
  try {
    const { data }: { data: { buch: Buch } } = await graphQLClient.query({
      query,
      variables: { id },
    })
    logger.debug('getBookById: data=%o', data)
    return data.buch
  } catch (error) {
    handleGraphQlError(error)
    return
  }
}

export const getBookAbbildungenById = async ({ id }: { id?: string }) => {
  logger.debug('getBookById: id=%s', id)

  if (!id) {
    return
  }

  const query = gql`
    query ($id: ID!) {
      buch(id: $id) {
        abbildungen {
          beschriftung
        }
      }
    }
  `
  try {
    const { data }: { data: { buch: Buch } } = await graphQLClient.query({
      query,
      variables: { id },
    })
    logger.debug('getBookAbbildungenById: data=%o', data)
    return data.buch
  } catch (error) {
    handleGraphQlError(error)
    return
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
