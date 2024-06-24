import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'

const certPath = path.resolve('app/config/tls/certificate.crt')
const certificate = fs.readFileSync(certPath)

const agent = new https.Agent({
  ca: certificate,
  rejectUnauthorized: false,
})

dotenv.config()

/**
 * Axios client to communicate with the backend
 */
export const client = axios.create({
  baseURL: process.env.NEST_BACKEND_URL,
  httpsAgent: agent,
  headers: {
    'Content-Type': 'application/json',
  },
})
