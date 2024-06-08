import express, { Response } from 'express'
import { CreateProductModel } from '../models/CreateProductModel'
import { GetProductsModel } from '../models/GetProductsModel'
import { ProductViewModel } from '../models/ProductViewModel'
import { UpdateProductModel } from '../models/UpdateProductModel'
import { URIParamsProductIdModel } from '../models/URIParamsProductIdModel'
import { RequestWithQuery, RequestWithParams, RequestWithBody, RequestWithParamsAndBody } from '../types'
import { HTTP_STATUSES } from '../utils'
import { productsRepository } from '../repositories/productsRepository'

export const getProductsRoutes = () => {
  const router = express.Router()

  router.get('/', (req: RequestWithQuery<GetProductsModel>, res: Response<ProductViewModel[]>) => {
    const foundProducts = productsRepository.findProducts(req.query.title || null)

    res.json(foundProducts)
  })

  router.get('/:id', (req: RequestWithParams<URIParamsProductIdModel>, res: Response<ProductViewModel>) => {
    const foundProduct = productsRepository.findProductById(+req.params.id || null)

    if (!foundProduct) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    res.json(foundProduct)
  })

  router.post('/', (req: RequestWithBody<CreateProductModel>, res: Response<ProductViewModel>) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
      return
    }

    const createdProduct = productsRepository.createProduct(req.body.title)

    res.status(HTTP_STATUSES.CREATED_201).json(createdProduct)
  })

  router.delete('/:id', (req: RequestWithParams<URIParamsProductIdModel>, res: Response) => {
    productsRepository.deleteProduct(+req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  router.put('/:id', (req: RequestWithParamsAndBody<URIParamsProductIdModel, UpdateProductModel>, res: Response) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
      return
    }

    const product = productsRepository.updateProduct(+req.params.id, req.body.title)

    if (!product) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  return router
}
