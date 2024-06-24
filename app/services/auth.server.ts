// app/services/auth.server.ts
import { Authenticator } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { FormStrategy } from 'remix-auth-form'
import { login, User } from '~/utils/rest/login'
import { logger } from '~/lib/logger'

const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username') as string
    const password = form.get('password') as string
    const user = (await login(username, password)) as User
    // logger.debug('user: user=%o', user)
    return user
  }),
)

export default authenticator
