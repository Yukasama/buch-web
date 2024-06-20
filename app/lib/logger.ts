import pino from 'pino'

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
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
})
