import { logger } from '~/lib/logger'
import { AxiosError, AxiosResponse } from 'axios'
import { Buch } from '~/lib/validators/book'
import { client } from '~/lib/axios-client'

/**
 * Get all books from the database
 * @returns All books from the database
 */
export const getAllBooks = async () => {
  try {
    const { data }: AxiosResponse<{ _embedded: Buch[] }> =
      await client.get(`/rest`)
    logger.debug('getAllBooks (done) length=%s', data._embedded.length)
    return data._embedded
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('getAllBooks (axios-error): message=%s', error.message)
    } else {
      logger.error('getAllBooks (error): error=%s', error)
    }
    return []
  }
}

/**
 * Get a book by its id
 * @param id Id of the book
 * @param version Current version on the client
 * @returns Book with the given id
 */
export const getBookById = async ({
  id,
  version,
}: {
  id: string
  version?: string
}) => {
  try {
    const { data, headers }: AxiosResponse<Buch> = await client.get(
      `/rest/${id}`,
      {
        headers: { 'If-None-Match': `"${version}"` },
      },
    )

    const eTag = headers.etag as string | undefined
    const currentVersion = eTag?.replace(/"/g, '') ?? '0'
    logger.debug('getBookById (done): id=%s, version=%s', id, currentVersion)

    return {
      ...data,
      id,
      version: currentVersion,
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('getBookById (axios-error): message=%s', error.message)
    } else {
      logger.error('updateBookById (error): error=%s', error)
    }
    return
  }
}
