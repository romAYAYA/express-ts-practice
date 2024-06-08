import { Request, Response, NextFunction } from 'express'

export const requestsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let requestsCount = 0

  requestsCount++
  next()
}
