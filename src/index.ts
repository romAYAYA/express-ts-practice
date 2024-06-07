import express, { Request, Response } from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types'
import { CreateProductModel } from './models/CreateProductModel'
import { GetProductsModel } from './models/GetProductsModel'
import { UpdateProductModel } from './models/UpdateProductModel'
import { ProductViewModel } from './models/ProductViewModel'
import { URIParamsProductIdModel } from './models/URIParamsProductIdModel'

export const app = express()
const port = process.env.PORT || 3000

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  NOT_FOUND: 404,
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type ProductType = {
  id: number
  title: string
  productsCount: number
}

const db: { products: ProductType[] } = {
  products: [
    { id: 1, title: 'tomato', productsCount: 15 },
    { id: 2, title: 'orange', productsCount: 19 },
    { id: 3, title: 'juice', productsCount: 5634 },
    { id: 4, title: 'laptop', productsCount: 23 },
  ],
}

const getProductViewModel = (dbProduct: ProductType): ProductViewModel => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
  }
}

app.get('/products', (req: RequestWithQuery<GetProductsModel>, res: Response<ProductViewModel[]>) => {
  let foundProducts = db.products

  if (req.query.title) {
    foundProducts = foundProducts.filter((p) => p.title.indexOf(req.query.title as string) > -1)
  }

  res.json(foundProducts.map(getProductViewModel))
})

app.get('/products/:id', (req: RequestWithParams<URIParamsProductIdModel>, res: Response<ProductViewModel>) => {
  const foundProduct = db.products.find((p) => p.id === +req.params.id)

  if (!foundProduct) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    return
  }

  res.json(getProductViewModel(foundProduct))
})

app.post('/products', (req: RequestWithBody<CreateProductModel>, res: Response<ProductViewModel>) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
    return
  }

  const createdProduct: ProductType = {
    id: +new Date(),
    title: req.body.title || 'unknown',
    productsCount: 0,
  }

  db.products.push(createdProduct)

  res.status(HTTP_STATUSES.CREATED_201).json(getProductViewModel(createdProduct))
})

app.delete('/products/:id', (req: RequestWithParams<URIParamsProductIdModel>, res) => {
  db.products = db.products.filter((p) => p.id !== +req.params.id)

  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.put('/products/:id', (req: RequestWithParamsAndBody<URIParamsProductIdModel, UpdateProductModel>, res: Response) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
    return
  }

  const course = db.products.find((p) => p.id === +req.params.id)

  if (!course) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    return
  }

  course.title = req.body.title

  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.delete('/__test__/data', (req: Request, res: Response) => {
  db.products = []
  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.listen(port, () => {
  console.log(`The app is Running on: http://localhost:${port}`)
})
