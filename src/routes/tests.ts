import express, { Request, Response } from 'express'
import { dbType } from '../db/db'
import { HTTP_STATUSES } from '../utils'

export const getTestsRouter = (db: dbType) => {
  const router = express.Router()

  router.delete('/data', (req: Request, res: Response) => {
    db.products = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
