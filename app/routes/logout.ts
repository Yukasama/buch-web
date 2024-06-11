import { redirect } from '@remix-run/node'
import { destroySession, getSession } from '~/services/session.server'

export async function action() {
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(await getSession()),
    },
  })
}
