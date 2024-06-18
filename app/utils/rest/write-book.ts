import { logger } from '~/lib/logger'
import { BuchUpdate } from '~/lib/validators/book'
import { getBookById } from './read-books'
import { client } from '~/lib/axios-client'
import { AxiosError } from 'axios'

/**
 * Create a book entry in the database
 * @param data Data to create a book without id
 * @returns Location with id of the created book
 */
export const createBook = async ({ data }: { data: BuchUpdate }) => {
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
 * @param mutateData Data to update the book with
 * @param access_token JWT access token from the user
 * @returns New version of the book
 */
export const updateBookById = async ({
  id,
  mutateData,
  access_token,
}: {
  id: string
  mutateData: BuchUpdate
  access_token: string
}) => {
  logger.debug(
    'updateBookById (attempt): id=%s, version=%s, mutateData=%o, access_token=%s',
    id,
    mutateData.version,
    mutateData,
    access_token,
  )

  const bookDb = await getBookById({ id })

  const insertData = {
    ...mutateData,
    titel: {
      titel: mutateData.titelwrapper,
      untertitel: mutateData.untertitelwrapper,
    },
    titelwrapper: undefined,
    untertitelwrapper: undefined,
  }

  try {
    const response = await client.put(
      `/rest/${id}`,
      {
        ...bookDb,
        ...insertData,
      },
      {
        headers: {
          'If-Match': `"${mutateData.version}"`,
          Authorization: `Bearer ${access_token}`,
        },
      },
    )

    logger.debug(
      'updateBookById (done): id=%s, version=%s',
      id,
      response.headers.ETag,
    )

    return { version: response.headers.ETag as string }
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error('updateBookById (axios-error): message=%s', error.message)
    } else {
      logger.error('updateBookById (error): error=%s', error)
    }
  }
  return { version: mutateData.version }
}
