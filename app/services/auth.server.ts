// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECERT } from '~/config/graphql'
import { KeycloakStrategy } from 'remix-keycloak'
import { sessionStorage, User } from '~/services/session.server'

// Create an instance of the authenticator, pass a Type, User,  with what
// strategies will return and will store in the session
const authenticator = new Authenticator<User | Error | null>(sessionStorage)

export const keycloakStrategy = new KeycloakStrategy(
  {
    useSSL: true,
    domain: 'http://localhost:8080',
    realm: 'acme',
    clientID: KEYCLOAK_CLIENT_SECERT,
    clientSecret: KEYCLOAK_CLIENT_ID,
    callbackURL: 'http://localhost:3000',
  },
  async ({ profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    return User.findOrCreate({  })
  },
)

authenticator.use(keycloakStrategy)

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    // get the data from the form...
    const email = form.get('email') as string
    const password = form.get('password') as string

    // initiialize the user here
    let user = null

    // do some validation, errors are in the sessionErrorKey
    // if (!email || email?.length === 0)
    //   throw new AuthorizationError('Bad Credentials: Email is required')
    // if (typeof email !== 'string')
    //   throw new AuthorizationError('Bad Credentials: Email must be a string')

    // if (!password || password?.length === 0)
    //   throw new AuthorizationError('Bad Credentials: Password is required')
    // if (typeof password !== 'string')
    //   throw new AuthorizationError('Bad Credentials: Password must be a string')

    // login the user, this could be whatever process you want
    if (email === 'admin@acme.com' && password === 'p') {
      user = {
        name: email,
        token: `${password}-${new Date().getTime()}`,
      }

      // the type of this user must match the type you pass to the Authenticator
      // the strategy will automatically inherit the type if you instantiate
      // directly inside the `use` method
      return await Promise.resolve({ ...user })
    } else {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError('Bad Credentials')
    }
  }),
)

export default authenticator
