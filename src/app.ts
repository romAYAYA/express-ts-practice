import express from 'express'
import { getProductsRoutes } from './routes/products'
import { db } from './db/db'
import { getTestsRouter } from './routes/tests'

export const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/api/products', getProductsRoutes(db))
app.use('/__test__', getTestsRouter(db))
