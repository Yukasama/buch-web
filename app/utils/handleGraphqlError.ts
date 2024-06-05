import { logger } from '~/lib/logger'
import { GraphQLError } from 'graphql'

export const handleGraphQlError = (error: unknown) => {
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
