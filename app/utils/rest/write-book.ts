import { logger } from '~/lib/logger'
import { BuchInput } from '~/lib/validators/book'
import { getBookById } from './read-books'
import { client } from '~/lib/axios-client'
import { AxiosError } from 'axios'

/**
 * Create a book entry in the database
 * @param data Data to create a book without id
 * @returns Location with id of the created book
 */
export const createBook = async ({ data }: { data: BuchInput }) => {
  logger.debug('createBook (attempt): data=%o', data)

  try {
    const response = await client.post(`/rest`, { data })
    const location = response.headers.Location as string

    logger.debug('createBook (done): location=%s', location)
    return location
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('createBook (axios-error): message=%s', error.message)
    } else {
      logger.error('createBook (error): error=%s', error)
    }
    return { ok: false }
  }
}

/**
 * Update a book entry in the database
 * @param id Id of the book to update
 * @param version Version of the current book
 * @param data Data to update the book with
 * @returns New version of the book
 */
export const updateBookById = async ({
  id,
  version,
  mutateData,
}: {
  id: string
  version: number
  mutateData: BuchInput
}) => {
  logger.debug(
    'updateBookById (attempt): id=%s, version,=%s mutateData=%o',
    id,
    version,
    mutateData,
  )

  const bookDb = await getBookById({ id })

  try {
    const response = await client.put(`/rest/${id}`, {
      headers: { 'E-Tag': `"${version}"` },
      data: {
        ...bookDb,
        ...mutateData,
        lieferbar: true,
      },
    })

    logger.debug(
      'updateBookById (done): id=%s, version=%s',
      id,
      response.headers['E-Tag'],
    )

    return { version: response.headers['E-Tag'] as string }
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('updateBookById (axios-error): message=%s', error.message)
    } else {
      logger.error('updateBookById (error): error=%s', error)
    }
    return { ok: false }
  }
}
