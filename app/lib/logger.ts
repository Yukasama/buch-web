import pino from 'pino'
// import { format } from 'date-fns'

const isProduction = process.env.NODE_ENV === 'production'

export const logger = pino({
  level: isProduction ? 'info' : 'debug',
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
