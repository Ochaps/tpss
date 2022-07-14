import { Router, Request, Response, NextFunction } from 'express'

import { check } from '@/middleware/schema'

import { computeSchema } from './schemas'
import { calculateSplit, ParameterError } from '@/helpers/split-computation'

const router = Router()

router.post(
  '/compute',
  check(computeSchema),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = calculateSplit(req.body)

      res.status(200).json({
        ...result
      })
    } catch (e: any) {
      switch (true) {
        case e instanceof ParameterError: {
          e.status = 401
          break
        }

        default: {
          break
        }
      }
      next(e)
    }
  }
)

export default router
