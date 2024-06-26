import { ActionFunctionArgs, json } from '@remix-run/node'
import { logger } from '~/lib/logger'
import { BuchUpdateSchlagwoerterSchema } from '~/lib/validators/book'
import authenticator from '~/services/auth.server'
import { updateBookById } from '~/utils/rest/write-book'

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const isAdmin = user?.role?.includes('admin')
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
    return json({ error: 'Invalid fields', version: '' }, { status: 400 })
  }

  const { schlagwoerter: schlagwoerterStr, version } = validated.data

  let schlagwoerter = []
  try {
    schlagwoerter = schlagwoerterStr.split(',').map((s) => s.trim())
  } catch {
    logger.debug(
      'updateSchlagwoerter [action (invalid-schlagwoerter): data=%o',
      data.schlagwoerter,
    )
    return json(
      { error: 'Invalid format for schlagwoerter', version: '' },
      { status: 400 },
    )
  }

  const mutateData = {
    version,
    schlagwoerter,
  }

  const { error, version: newVersion } = await updateBookById({
    id: params.id,
    mutateData,
    access_token: user.access_token,
  })

  return json({ error, version: newVersion })
}
