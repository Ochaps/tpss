import { Request, Response, NextFunction } from 'express'
import * as Yup from 'yup'

export const check = (schema: Yup.AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false })
      req.body = schema.cast(req.body)
      next()
    } catch (err: any) {
      res.status(422).json({ error: err.errors })
    }
  }
}
