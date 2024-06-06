import { gql, FetchResult } from '@apollo/client/index.js'
import { graphQLClient } from '~/lib/apollo-client'
import { logger } from '~/lib/logger'
import { handleReqError } from '../handleReqError'
import { Buch } from '~/graphql/__generated__/graphql'
import { getBookById } from './query-books'

export const updateBookById = async ({
  id,
  mutateData,
}: {
  id?: string
  mutateData: Partial<Buch>
}) => {
  logger.debug('updateBookById: id=%s mutateData=%o', id, mutateData)

  if (!id) {
    return
  }

  const bookDb = await getBookById({ id })

  const mutation = gql`
    mutation update($data: BuchUpdateInput!) {
      update(input: $data) {
        version
      }
    }
  `
  try {
    const { data }: FetchResult<{ version: number }> =
      await graphQLClient.mutate({
        mutation,
        variables: {
          data: {
            ...bookDb,
            ...mutateData,
            __typename: undefined,
            titel: undefined,
            preis: Number(mutateData.preis),
            rabatt: Number(mutateData.rabatt?.replace('%', '').trim()),
            lieferbar: true,
          },
        },
      })

    logger.debug('updateBookById: id=%s, version=%s', id, data?.version)
    return data?.version
  } catch (error) {
    handleReqError(error)
    return
  }
}
