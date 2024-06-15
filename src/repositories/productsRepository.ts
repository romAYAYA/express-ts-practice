import { RowDataPacket, ResultSetHeader } from 'mysql2'
import pool from '../db/connection'

interface ProductViewModel extends RowDataPacket {
  id: number
  title: string
  productsCount: number
}

export const productsRepository = {
  async findProducts(title: string | null) {
    try {
      let query = 'SELECT id, title FROM products'
      const queryParams = []

      if (title) {
        query += ' WHERE title LIKE ?'
        queryParams.push(`%${title}%`)
      }

      const [rows] = await pool.query<ProductViewModel[]>(query, queryParams)
      return rows
    } catch (error) {
      console.error('Error finding products:', error)
      throw error
    }
  },

  async findProductById(id: number | null) {
    try {
      const [rows] = await pool.query<ProductViewModel[]>('SELECT id, title FROM products WHERE id = ?', [id])
      return rows[0] || null
    } catch (error) {
      console.error('Error finding product by ID:', error)
      throw error
    }
  },

  async createProduct(title: string) {
    try {
      const [result] = await pool.query<ResultSetHeader>('INSERT INTO products (title, productsCount) VALUES (?, ?)', [title, 0])
      const [insertedProduct] = await pool.query<ProductViewModel[]>('SELECT * FROM products WHERE id = ?', [result.insertId])
      return insertedProduct[0] || null
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  async deleteProduct(id: number) {
    try {
      await pool.query('DELETE FROM products WHERE id = ?', [id])
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  },

  async updateProduct(id: number, title: string) {
    try {
      await pool.query('UPDATE products SET title = ? WHERE id = ?', [title, id])
      const [updatedProduct] = await pool.query<RowDataPacket[]>('SELECT id, title FROM products WHERE id = ?', [id])
      return updatedProduct[0] || null
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },
}
