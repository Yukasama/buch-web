import axios from 'axios'
import dotenv from 'dotenv'
//import https from 'node:https'
//import path from 'node:path'
//import fs from 'node:fs'

//const certPath = path.resolve('app/config/tls/certificate.crt')
//const certificate = fs.readFileSync(certPath)

//const agent = new https.Agent({
//ca: certificate,
// rejectUnauthorized: true,
// })

/**
 * Axios client to communicate with the backend
 */
dotenv.config()
export const client = axios.create({
  baseURL: process.env.NEST_BACKEND_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})
