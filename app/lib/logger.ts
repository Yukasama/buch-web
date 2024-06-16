import pino from 'pino'

// Überprüfen, ob process definiert ist
const isNode = typeof process !== 'undefined'

// Fallback-Werte für Browsererkennung
const isProduction = isNode ? process.env.NODE_ENV === 'production' : false
const logLevel = isNode ? process.env.LOG_LEVEL ?? 'info' : 'info'

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
