import express, { Response } from 'express'
import { CreateProductModel } from '../models/CreateProductModel'
import { GetProductsModel } from '../models/GetProductsModel'
import { ProductViewModel } from '../models/ProductViewModel'
import { UpdateProductModel } from '../models/UpdateProductModel'
import { URIParamsProductIdModel } from '../models/URIParamsProductIdModel'
import { RequestWithQuery, RequestWithParams, RequestWithBody, RequestWithParamsAndBody } from '../types'
import { ProductType, dbType } from '../db/db'
import { HTTP_STATUSES } from '../utils'

const getProductViewModel = (dbProduct: ProductType): ProductViewModel => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
  }
}

export const getProductsRoutes = (db: dbType) => {
  const router = express.Router()

  router.get('/', (req: RequestWithQuery<GetProductsModel>, res: Response<ProductViewModel[]>) => {
    let foundProducts = db.products

    if (req.query.title) {
      foundProducts = foundProducts.filter((p) => p.title.indexOf(req.query.title as string) > -1)
    }

    res.json(foundProducts.map(getProductViewModel))
  })

  router.get('/:id', (req: RequestWithParams<URIParamsProductIdModel>, res: Response<ProductViewModel>) => {
    const foundProduct = db.products.find((p) => p.id === +req.params.id)

    if (!foundProduct) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    res.json(getProductViewModel(foundProduct))
  })

  router.post('/', (req: RequestWithBody<CreateProductModel>, res: Response<ProductViewModel>) => {
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

  router.delete('/:id', (req: RequestWithParams<URIParamsProductIdModel>, res: Response) => {
    db.products = db.products.filter((p) => p.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  router.put('/:id', (req: RequestWithParamsAndBody<URIParamsProductIdModel, UpdateProductModel>, res: Response) => {
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

  return router
}
