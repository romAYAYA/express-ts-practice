import { ResultSetHeader } from 'mysql2'
import pool from '../db/connection'
import { ProductViewModel } from '../db/init'

export const productsRepository = {
  async findProducts(title: string): Promise<ProductViewModel[]> {
    let query = 'SELECT id, title FROM products'
    const queryParams = []

    if (title) {
      query += ' WHERE title LIKE ?'
      queryParams.push(`%${ title }%`)
    }

    const [rows] = await pool.query<ProductViewModel[]>(query, queryParams)
    return rows
  },

  async findProductById(id: number): Promise<ProductViewModel | null> {
    const [rows] = await pool.query<ProductViewModel[]>('SELECT id, title FROM products WHERE id = ?', [id])
    return rows[0] || null
  },

  async createProduct(title: string): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO products (title) VALUES (?)', [title])
    return result.insertId
  },

  async deleteProduct(id: number) {
    await pool.query('DELETE FROM products WHERE id = ?', [id])
  },

  async updateProduct(id: number, title: string): Promise<void> {
    await pool.query('UPDATE products SET title = ? WHERE id = ?', [title, id])
  },
}
