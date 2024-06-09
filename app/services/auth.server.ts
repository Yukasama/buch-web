// app/services/auth.server.ts
import { Authenticator } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { FormStrategy } from 'remix-auth-form'
import { AxiosInstance, AxiosResponse } from 'axios'

const authenticator = new Authenticator<User>(sessionStorage)
let client: AxiosInstance

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get('username') as string
    const password = form.get('password') as string
    return (await login(client, username, password)) as User
  }),
  'keycloak',
)

export default authenticator

export interface User {
  username: string
  access_token: string
  refresh_token: string
}

export const loginPath = 'https://localhost:3000/auth/login'

interface LoginResponse {
  access_token: string
  refresh_token: string
}

export const login = async (
  axiosInstance: AxiosInstance,
  username: string,
  password: string,
) => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded', // eslint-disable-line @typescript-eslint/naming-convention
    }
    const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
      loginPath,
      `username=${username}&password=${password}`,
      { headers },
    )

    console.log(response.data)

    return {
      username,
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
    }
  } catch (error) {
    console.error(error)
  }
}
