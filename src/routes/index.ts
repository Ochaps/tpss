import { Router, Request, Response, NextFunction } from 'express'
import splitPayment from './split-payment'

const router = Router()

router.use('/split-payments', splitPayment)

// handle 404 requests
router.use((_req: Request, _res: Response, next: NextFunction) => {
  const err = new Error('Not Found') as RouteError
  err.status = 404
  next(err)
})

// handle 500 errors
router.use(
  (err: RouteError, _req: Request, res: Response, _next: NextFunction) => {
    let status = err.status || 500

    res.status(status).json({
      success: false,
      error: err.message || err || 'Internal Server Error'
    })
  }
)

export default router
