import { AxiosResponse } from 'axios'
import dotenv from 'dotenv'
import { jwtDecode } from 'jwt-decode'
import { client } from '~/lib/axios-client'

dotenv.config()

export const loginPath = `${process.env.NEST_BACKEND_URL}/auth/login`

export const login = async (username: string, password: string) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  const response: AxiosResponse<LoginResult> = await client.post(
    loginPath,
    `username=${username}&password=${password}`,
    { headers },
  )

  return {
    username: username,
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    role: (jwtDecode(response.data.access_token) as JwtPayload).resource_access[ //NOSONAR
      'buch-client'
    ].roles,
  }
}

interface JwtPayload {
  resource_access: {
    'buch-client': {
      roles: string[]
    }
  }
}

interface LoginResult {
  access_token: string
  refresh_token: string
}

export interface User {
  username: string
  access_token: string
  refresh_token: string
  role: string[]
}
