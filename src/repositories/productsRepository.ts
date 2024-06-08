import { db, ProductType } from '../db/db'
import { ProductViewModel } from '../models/ProductViewModel'

const getProductViewModel = (dbProduct: ProductType): ProductViewModel => {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
  }
}

export const productsRepository = {
  findProducts(title: string | null) {
    let foundProducts = db.products

    if (title) {
      foundProducts = foundProducts.filter((p) => p.title.indexOf(title as string) > -1)
    }

    return foundProducts.map(getProductViewModel)
  },

  findProductById(id: number | null) {
    const foundProduct = db.products.find((p) => p.id === id)
    if (!foundProduct) {
      return null
    }

    return getProductViewModel(foundProduct)
  },

  createProduct(title: string) {
    const createdProduct: ProductType = {
      id: +new Date(),
      title: title || 'unknown',
      productsCount: 0,
    }

    db.products.push(createdProduct)

    return getProductViewModel(createdProduct)
  },

  deleteProduct(id: number) {
    db.products = db.products.filter((p) => p.id !== id)
  },

  updateProduct(id: number, title: string) {
    const product = db.products.find((p) => p.id === id)
    if (!product) {
      return null
    }

    product.title = title

    return product
  },
}
