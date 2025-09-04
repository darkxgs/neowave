const { Pool } = require('pg')
const fs = require('fs')
const csv = require('csv-parser')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function importCategories() {
  console.log('Importing categories...')
  const categories = []
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('product_categories_rows.csv')
      .pipe(csv())
      .on('data', (row) => {
        categories.push(row)
      })
      .on('end', async () => {
        try {
          for (const category of categories) {
            await pool.query(
              'INSERT INTO categories (category_id, name, types, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (category_id) DO UPDATE SET name = $2, types = $3, updated_at = $5',
              [category.id, category.name, category.types, category.created_at, category.updated_at]
            )
          }
          console.log(`Imported ${categories.length} categories`)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
  })
}

async function importFilters() {
  console.log('Importing filters...')
  const filters = []
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('product_filters_rows.csv')
      .pipe(csv())
      .on('data', (row) => {
        filters.push(row)
      })
      .on('end', async () => {
        try {
          for (const filter of filters) {
            // Map type_id to type field and handle predefined as options
            const options = JSON.stringify([{ predefined: filter.predefined === 'true' }])
            await pool.query(
              'INSERT INTO filters (filter_id, name, type, options, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (filter_id) DO UPDATE SET name = $2, type = $3, options = $4, updated_at = $6',
              [filter.id, filter.name, filter.type_id, options, filter.created_at, filter.updated_at]
            )
          }
          console.log(`Imported ${filters.length} filters`)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
  })
}

async function importProducts() {
  console.log('Importing products...')
  const products = []
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('products_rows.csv')
      .pipe(csv())
      .on('data', (row) => {
        products.push(row)
      })
      .on('end', async () => {
        try {
          for (const product of products) {
            await pool.query(
              'INSERT INTO products (id, code, type, category, name, description, specifications, photo_url, datasheet_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO UPDATE SET code = $2, type = $3, category = $4, name = $5, description = $6, specifications = $7, photo_url = $8, datasheet_url = $9, updated_at = $11',
              [
                product.id,
                product.code,
                product.type,
                product.category,
                product.name,
                product.description || null,
                product.specifications || null,
                product.photo_url || null,
                product.datasheet_url || null,
                product.created_at,
                product.updated_at
              ]
            )
          }
          console.log(`Imported ${products.length} products`)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
  })
}

async function main() {
  try {
    console.log('Starting CSV data import to NeonDB...')
    
    // Import in order: categories first, then filters, then products
    await importCategories()
    await importFilters()
    await importProducts()
    
    console.log('\nData import completed successfully!')
    
    // Verify the import
    const categoryCount = await pool.query('SELECT COUNT(*) FROM categories')
    const filterCount = await pool.query('SELECT COUNT(*) FROM filters')
    const productCount = await pool.query('SELECT COUNT(*) FROM products')
    
    console.log('\nVerification:')
    console.log(`Categories: ${categoryCount.rows[0].count}`)
    console.log(`Filters: ${filterCount.rows[0].count}`)
    console.log(`Products: ${productCount.rows[0].count}`)
    
  } catch (error) {
    console.error('Import failed:', error)
  } finally {
    await pool.end()
  }
}

if (require.main === module) {
  main()
}

module.exports = { importCategories, importFilters, importProducts }