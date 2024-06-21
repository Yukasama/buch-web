import type { AxiosError } from 'axios'

export const formatErrorMsg = (error: AxiosError) => {
  return error.message.includes('412')
    ? 'Your data is outdated. Please refresh the page.'
    : error.message.includes('401')
      ? 'You have to be logged in to make changes.'
      : error.message
}
