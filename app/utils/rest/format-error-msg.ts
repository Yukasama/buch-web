import type { AxiosError } from 'axios'

const errorMessages = {
  400: 'You have entered invalid data. Please check your input.',
  401: 'You have to be logged in to make changes.',
  412: 'Your data is outdated. Please refresh the page.',
  422: 'This ISBN already exists in the system.',
}

export const formatErrorMsg = (error: AxiosError): string => {
  const statusCode = error.response?.status

  switch (statusCode) {
    case 400: {
      return errorMessages[400]
    }
    case 401: {
      return errorMessages[401]
    }
    case 412: {
      return errorMessages[412]
    }
    case 422: {
      return errorMessages[422]
    }
    default: {
      return error.message
    }
  }
}
