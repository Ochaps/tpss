import http from 'http'
import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { PORT, isProduction } from '@/config'

export const createServer = (): Promise<Application> =>
  new Promise((resolve, reject) => {
    const app = express()

    // setup basic cors
    app.use(cors())

    // setup route logging
    const morganInstance = isProduction ? morgan('combined') : morgan('dev')
    app.use(morganInstance)

    // setup parsers
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())

    const server = http.createServer(app)

    server.on('listening', () => resolve(app))
    server.on('error', reject)

    server.listen(PORT)
  })
