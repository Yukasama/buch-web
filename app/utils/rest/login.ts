import { AxiosResponse } from 'axios'
import { logger } from '~/lib/logger'
import { client } from '../../lib/axios-client'

export const login = async (username: string, password: string) => {
  const axiosInstance = client
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded', // eslint-disable-line @typescript-eslint/naming-convention
    }
    const response: AxiosResponse<LoginResult> = await axiosInstance.post(
      loginPath,
      {
        headers,
        data: {
          username: username,
          password: password,
        },
      },
    )

    logger.debug(response.data)

    return {
      username,
      access_token: response.data.access_token,
    }
  } catch (error) {
    logger.error(error)
  }
}

interface LoginResult {
  access_token: string
}

export interface User {
  username: string
  access_token: string
  refresh_token: string
}

export const loginPath = 'https://localhost:3000/auth/login'
