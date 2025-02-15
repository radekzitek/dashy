import log from 'loglevel'
import { api } from '../boot/axios'

// Set the logging level (can be adjusted as needed)
log.setLevel('debug')

// Define an interface for meta data
interface LogMeta {
  [key: string]: unknown
}

// Function to send log messages to the backend logging endpoint
function sendLog(level: string, message: string, meta: LogMeta = {}): void {
  console.log('Sending log:', level, message, meta)
    api
    .post('/api/logs/', {
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    })
    .catch((error) => {
      // In case of error sending log, print to console to avoid infinite loop
      console.error('Failed to send log:', error)
    })
}

// Preserve original log methods and override them with additional behavior
const originalDebug = log.debug.bind(log)
log.debug = (message: string, ...args: unknown[]): void => {
  originalDebug(message, ...args)
  sendLog('DEBUG', message, { args })
}

const originalInfo = log.info.bind(log)
log.info = (message: string, ...args: unknown[]): void => {
  originalInfo(message, ...args)
  sendLog('INFO', message, { args })
}

const originalWarn = log.warn.bind(log)
log.warn = (message: string, ...args: unknown[]): void => {
  originalWarn(message, ...args)
  sendLog('WARNING', message, { args })
}

const originalError = log.error.bind(log)
log.error = (message: string, ...args: unknown[]): void => {
  originalError(message, ...args)
  sendLog('ERROR', message, { args })
}

export default log
