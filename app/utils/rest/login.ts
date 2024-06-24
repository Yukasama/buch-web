import { AxiosResponse } from 'axios'
import { logger } from '~/lib/logger'
import { client } from '../../lib/axios-client'
import { jwtDecode } from 'jwt-decode'
import dotenv from 'dotenv'

dotenv.config()

export const loginPath = `${process.env.NEST_BACKEND_URL}/auth/login`

export const login = async (username: string, password: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded', // eslint-disable-line @typescript-eslint/naming-convention
  }
  const response: AxiosResponse<LoginResult> = await client.post(
    loginPath,
    `username=${username}&password=${password}`,
    { headers },
  )
  logger.debug('login (success)')
  return {
    username: username,
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    role: jwtDecode(response.data.access_token).resource_access['buch-client']
      .roles,
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
