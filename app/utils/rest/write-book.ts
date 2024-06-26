import { AxiosError } from 'axios'
import { client } from '~/lib/axios-client'
import { logger } from '~/lib/logger'
import { BuchCreate, BuchUpdate } from '~/lib/validators/book'
import { formatErrorMsg } from './format-error-msg'
import { getBookById } from './read-books'

/**
 * Create a book entry in the database
 * @param data Data to create a book without id
 * @returns Location with id of the created book
 */
export const createBook = async ({
  insertData,
  access_token,
}: {
  insertData: BuchCreate
  access_token: string
}) => {
  const payload = {
    ...insertData,
    titel: {
      titel: insertData.titelwrapper,
      untertitel: insertData.untertitelwrapper,
    },
    rabatt: Number(insertData.rabatt) / 100,
    titelwrapper: undefined,
    untertitelwrapper: undefined,
  }

  try {
    const { headers } = await client.post('/rest', payload, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const location = headers.location as string | undefined
    const id = location?.split('/').pop()

    logger.debug('createBook (done): id=%s payload=%s', id, payload)
    return { id }
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.debug('createBook (axios-error): message=%s', error.message)
      return { error: formatErrorMsg(error) }
    } else {
      logger.error('createBook (error): error=%s', error)
    }

    return { error: 'Internal server error' }
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
  mutateData: Partial<BuchUpdate>
  access_token: string
}) => {
  const bookDb = await getBookById({ id })

  const payload = {
    ...bookDb,
    ...mutateData,
    lieferbar:
      'lieferbar' in mutateData
        ? Boolean(mutateData.lieferbar)
        : Boolean(bookDb?.lieferbar),
  }

  try {
    const { headers } = await client.put(`/rest/${id}`, payload, {
      headers: {
        'If-Match': `"${mutateData.version}"`,
        Authorization: `Bearer ${access_token}`,
      },
    })

    const eTag = headers.etag as string | undefined
    const currentVersion = eTag?.replace(/"/g, '') ?? '0'

    logger.debug(
      'updateBookById (done): id=%s, version=%s, payload=%o',
      id,
      currentVersion,
      payload,
    )

    return { version: currentVersion }
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.debug(
        'updateBookById (axios-error): id=%s message=%s',
        id,
        error.message,
      )
      return { error: formatErrorMsg(error) }
    } else {
      logger.error('updateBookById (error): error=%s', error)
    }
  }

  return { error: 'Internal Server Error' }
}
