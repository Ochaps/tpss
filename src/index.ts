import { Logger } from 'moment-logger'

import { createServer } from '@/www'

import routes from '@/routes'

import { isProduction, PORT } from '@/config'

const log = new Logger({
  showErrorStack: !isProduction
})

const start = async () => {
  try {
    log.info(`Starting TPSS Service on port ${PORT}`)
    const app = await createServer()
    app.use(routes)
  } catch (e) {
    log.error(e)
  }
}

start()
