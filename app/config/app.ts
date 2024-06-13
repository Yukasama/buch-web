const isProduction = process.env.NODE_ENV === 'production'

export const appConfig = {
  backendUrl: isProduction
    ? 'https://ec2-35-159-81-27.eu-central-1.compute.amazonaws.com:3000'
    : 'https://localhost:3000',
  url: isProduction ? 'https://buch-web.zenathra.com' : 'http://localhost:5173',
}
