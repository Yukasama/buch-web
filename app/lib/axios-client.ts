import axios from 'axios'
import { appConfig } from '~/config/app'
//import https from 'node:https'
//import path from 'node:path'
//import fs from 'node:fs'

//const url = appConfig.backendUrl

//const certPath = path.resolve('app/config/tls/certificate.crt')
//const certificate = fs.readFileSync(certPath)

//const agent = new https.Agent({
//ca: certificate,
// rejectUnauthorized: true,
// })

/**
 * Axios client to communicate with the backend
 */
export const client = axios.create({
  baseURL: appConfig.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})
