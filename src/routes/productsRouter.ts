import express, { Response } from 'express'
import { body } from 'express-validator'
import { CreateProductModel } from '../models/CreateProductModel'
import { GetProductsModel } from '../models/GetProductsModel'
import { ProductViewModel } from '../models/ProductViewModel'
import { UpdateProductModel } from '../models/UpdateProductModel'
import { URIParamsProductIdModel } from '../models/URIParamsProductIdModel'
import { RequestWithQuery, RequestWithParams, RequestWithBody, RequestWithParamsAndBody, ValidationErrorResponse } from '../types'
import { HTTP_STATUSES } from '../utils'
import { productsRepository } from '../repositories/productsRepository'
import { inputValidationMiddleware } from '../middlewares/inputValidationMiddleware'

const titleValidation = body('title').trim().isLength({ min: 3, max: 30 }).withMessage('Title length should be from 3 to 30 symbols')

export const getProductsRoutes = () => {
  const router = express.Router()

  router.get('/', async (req: RequestWithQuery<GetProductsModel>, res: Response<ProductViewModel[]>) => {
    const foundProducts = await productsRepository.findProducts(req.query.title || null)

    res.json(foundProducts)
  })

  router.get('/:id', async (req: RequestWithParams<URIParamsProductIdModel>, res: Response<ProductViewModel>) => {
    const foundProduct = await productsRepository.findProductById(+req.params.id || null)

    if (!foundProduct) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND)
      return
    }

    res.json(foundProduct)
  })

  router.post(
    '/',
    titleValidation,
    inputValidationMiddleware,
    async (req: RequestWithBody<CreateProductModel>, res: Response<ProductViewModel | ValidationErrorResponse>) => {
      const createdProduct = await productsRepository.createProduct(req.body.title)
      res.status(HTTP_STATUSES.CREATED_201).json(createdProduct)
    }
  )

  router.delete('/:id', async (req: RequestWithParams<URIParamsProductIdModel>, res: Response) => {
    await productsRepository.deleteProduct(+req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
  })

  router.put(
    '/:id',
    titleValidation,
    inputValidationMiddleware,
    async (req: RequestWithParamsAndBody<URIParamsProductIdModel, UpdateProductModel>, res: Response) => {
      const product = await productsRepository.updateProduct(+req.params.id, req.body.title)
      if (!product) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND)
        return
      }

      res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    }
  )

  return router
}
