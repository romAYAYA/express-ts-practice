import pool from './connection'

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