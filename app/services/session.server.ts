// app/services/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node'
import { loginKeycloak } from '~/utils/login-keycloak'

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // use any name you want here
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['boisen'], // replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
  },
})

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage

// define the user model
export interface User {
  username: string
  password: string
  access_token: string
  refresh_token: string

  function login() :User {
    return loginKeycloak({ username, password })
  }
}
