import express from 'express'
import { getProductsRoutes } from './routes/productsRouter'
import { db } from './db/db'
import { getTestsRouter } from './routes/testsRouter'

export const app = express()

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/api/products', getProductsRoutes())
app.use('/__test__', getTestsRouter(db))
