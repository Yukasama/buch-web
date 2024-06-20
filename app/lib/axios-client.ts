import axios from 'axios'
import dotenv from 'dotenv'
import https from 'node:https'
import path from 'node:path'
import fs from 'node:fs'

const certPath = path.resolve('app/config/tls/certificate.crt')
const certificate = fs.readFileSync(certPath)

const agent = new https.Agent({
  ca: certificate,
  rejectUnauthorized: true,
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
