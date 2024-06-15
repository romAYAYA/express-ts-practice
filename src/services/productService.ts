import { ProductViewModel } from '../db/init'
import { productsRepository } from '../repositories/productsRepository'

export const productsServices = {
  async findProducts(title: string): Promise<ProductViewModel[]> {
    return productsRepository.findProducts(title)
  },

  async findProductById(id: number): Promise<ProductViewModel | null> {
    return productsRepository.findProductById(id)
  },

  async createProduct(title: string): Promise<ProductViewModel> {
    const insertId = await productsRepository.createProduct(title)
    const insertedProduct = await productsRepository.findProductById(insertId)
    if (!insertedProduct) {
      throw new Error('Product creation failed')
    }
    return insertedProduct
  },

  async deleteProduct(id: number) {
    await productsRepository.deleteProduct(id)
  },

  async updateProduct(id: number, title: string): Promise<ProductViewModel | null> {
    await productsRepository.updateProduct(id, title)
    const updatedProduct = await productsRepository.findProductById(id)
    if (!updatedProduct) {
      throw new Error('Product update failed')
    }
    return updatedProduct
  },
}
