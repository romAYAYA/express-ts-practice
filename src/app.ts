import express from 'express'
import { getProductsRoutes } from './routes/productsRouter'
import { getTestsRouter } from './routes/testsRouter'
import { requestsMiddleware } from './middlewares/requestsMiddleware'

export const app = express()

app.use(express.json())
app.use(requestsMiddleware)

app.use('/api/products', getProductsRoutes())
// app.use('/__test__', getTestsRouter(db))
