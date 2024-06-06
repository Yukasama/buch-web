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
    const { data }: AxiosResponse<Buch[]> = await client.get(`/rest`)
    logger.debug('getAllBooks (done) length=%s', data.length)
    return data
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
  version?: number
}) => {
  try {
    const { data }: AxiosResponse<Buch> = await client.get(`/rest/${id}`, {
      headers: { 'E-Tag': `"${version}"` },
    })

    logger.debug('getBookById (done): book=%o', data)
    return data
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('getBookById (axios-error): message=%s', error.message)
    } else {
      logger.error('updateBookById (error): error=%s', error)
    }
    return
  }
}
