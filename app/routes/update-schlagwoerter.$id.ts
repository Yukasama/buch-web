import { ActionFunctionArgs, json } from '@remix-run/node'
import { AxiosError } from 'axios'
import { client } from '~/lib/axios-client'
import { logger } from '~/lib/logger'
import { BuchUpdateSchlagwoerterSchema } from '~/lib/validators/book'
import authenticator from '~/services/auth.server'
import { getBookById } from '~/utils/rest/read-books'
import { formatErrorMsg } from '~/utils/rest/format-error-msg'

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const isAdmin = user.username === 'admin'
  if (!isAdmin) {
    throw new Response('No Access', { status: 403 })
  }

  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const validated = BuchUpdateSchlagwoerterSchema.safeParse(data)
  if (!validated.success) {
    logger.debug('book [action] (invalid-fields): values=%o', validated)
    return json({ error: 'Invalid fields' }, { status: 400 })
  }

  const {
    schlagwoerter: schlagwoerterStr,
    version,
    access_token,
  } = validated.data

  let schlagwoerter = []
  try {
    schlagwoerter = schlagwoerterStr.split(',').map((s) => s.trim())
  } catch (error) {
    logger.debug(
      'updateSchlagwoerter [action] Invalid JSON format for schlagwoerter: %o',
      data.schlagwoerter,
    )
    return json({ error: 'Invalid format for schlagwoerter' }, { status: 400 })
  }

  const bookDb = await getBookById({ id: params.id })

  const insertData = {
    ...bookDb,
    // schlagwoerter,
  }

  console.log(insertData, 'insertData')

  try {
    const { headers } = await client.put(`/rest/${params.id}`, insertData, {
      headers: {
        'If-Match': `"${version}"`,
        Authorization: `Bearer ${access_token}`,
      },
    })

    logger.debug(
      'updateSchlagwoerter [action] (done): id=%s, version=%s',
      params.id,
      headers.ETag,
    )

    return json({ version: headers.ETag as string })
  } catch (error) {
    if (error instanceof AxiosError) {
      logger.error(
        'updateSchlagwoerter [action] (axios-error): message=%s',
        error.message,
      )
      return { error: formatErrorMsg(error) }
    } else {
      logger.error('updateSchlagwoerter [action] (error): error=%s', error)
    }

    return json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
