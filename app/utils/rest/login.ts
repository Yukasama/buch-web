import { AxiosResponse } from 'axios'
import dotenv from 'dotenv'
import { jwtDecode } from 'jwt-decode'
import { client } from '~/lib/axios-client'
import { logger } from '~/lib/logger'

dotenv.config()

export const loginPath = `${process.env.NEST_BACKEND_URL}/auth/login`

export const login = async (username: string, password: string) => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded', // eslint-disable-line @typescript-eslint/naming-convention
  }
  const response: AxiosResponse<LoginResult> = await client.post(
    loginPath,
    `username=${username}&password=${password}`,
    { headers },
  )
  logger.debug('login (done): username=%s, password=%s', username, password)

  return {
    username: username,
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    role: (jwtDecode(response.data.access_token) as any).resource_access[
      'buch-client'
    ].roles,
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
