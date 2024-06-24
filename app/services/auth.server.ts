// app/services/auth.server.ts
import { Authenticator } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { FormStrategy } from 'remix-auth-form'
import { login, User } from '~/utils/rest/login'

const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username') as string
    const password = form.get('password') as string
    return (await login(username, password)) as User
  }),
)

export default authenticator
