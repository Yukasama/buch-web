import pino from 'pino'
// import { format } from 'date-fns'

const isProduction = process.env.NODE_ENV === 'production'
const logLevel = process.env.LOG_LEVEL ?? 'info'

const validLogLevels = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
]

if (!validLogLevels.includes(logLevel)) {
  throw new Error(
    `Invalid log level: ${logLevel}. Valid log levels are: ${validLogLevels.join(', ')}`,
  )
}

export const logger = pino({
  level: logLevel,
  // timestamp: () => `,"time":"${format(new Date(), 'HH:mm:ss')}"`,
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
})
