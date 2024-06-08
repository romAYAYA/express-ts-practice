import pool from './dbConfig'

const createTables = async () => {
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      productsCount INT NOT NULL
    );
  `

  try {
    const connection = await pool.getConnection()
    await connection.query(createProductsTable)
    console.log('Tables created successfully')
    connection.release()
  } catch (error) {
    console.error('Error creating tables: ', error)
  }
}

createTables()

// export type ProductType = {
//   id: number
//   title: string
//   productsCount: number
// }

// export const db: { products: ProductType[] } = {
//   products: [
//     { id: 1, title: 'tomato', productsCount: 15 },
//     { id: 2, title: 'orange', productsCount: 19 },
//     { id: 3, title: 'juice', productsCount: 5634 },
//     { id: 4, title: 'laptop', productsCount: 23 },
//   ],
// }

// export type dbType = { products: ProductType[] }
