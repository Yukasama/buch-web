import { redirect } from '@remix-run/node'
import { logger } from '~/lib/logger'
import { destroySession, getSession } from '~/services/session.server'

export async function action() {
  logger.debug('logout (done)')
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(await getSession()),
    },
  })
}

export function loader() {
  return redirect('/')
}
