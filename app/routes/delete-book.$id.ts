import { ActionFunctionArgs, json } from '@remix-run/node'
import authenticator from '~/services/auth.server'
import { deleteBookById } from '../utils/rest/write-book'

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

  const { ok, error } = await deleteBookById({
    id: params.id,
    access_token: user.access_token,
  })

  return json({ ok, error })
}
