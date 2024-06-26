import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from '~/services/session.server'
import { login, User } from '~/utils/rest/login'

const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = String(form.get('username'))
    const password = String(form.get('password'))
    return (await login(username, password)) as User
  }),
)

export default authenticator
