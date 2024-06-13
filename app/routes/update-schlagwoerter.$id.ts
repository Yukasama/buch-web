import { ActionFunctionArgs, json } from '@remix-run/node'
import { AxiosError } from 'axios'
import { client } from '~/lib/axios-client'
import { logger } from '~/lib/logger'
import { getBookById } from '~/utils/rest/read-books'

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const { schlagwoerter: schlagwoerterStr } = data

  let schlagwoerter = []
  try {
    schlagwoerter = (schlagwoerterStr as string).split(',').map((s) => s.trim())
  } catch (error) {
    logger.debug(
      'Invalid JSON format for schlagwoerter: %o',
      data.schlagwoerter,
    )
    return json(
      { errors: [{ message: 'Invalid format for schlagwoerter' }] },
      { status: 400 },
    )
  }

  const versionStr = request.headers.get('E-Tag')
  const version = versionStr ? Number(versionStr.replace(/"/g, '')) : 0

  const bookDb = await getBookById({ id: params.id })

  try {
    const response = await client.put(`/rest/${params.id}`, {
      headers: { 'E-Tag': `"${version}"` },
      data: {
        ...bookDb,
        ...schlagwoerter,
      },
    })

    logger.debug(
      'updateSchlagwoerter (done): id=%s, version=%s',
      params.id,
      response.headers['E-Tag'],
    )

    return { ok: true }
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(
        'updateSchlagwoerter [action] (axios-error): id=%s message=%s',
        params.id,
        error.message,
      )
    } else {
      logger.error('updateSchlagwoerter [action] (error): error=%s', error)
    }
  }
  return { ok: false }
}
