const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_D2NaQwE5kFRo@ep-winter-unit-agudm8eu-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to parse specifications from CSV
function parseSpecifications(specificationsStr, filtersStr) {
  let specifications = [];
  let filters = [];
  
  try {
    // Parse specifications JSON
    if (specificationsStr && specificationsStr.trim()) {
      specifications = JSON.parse(specificationsStr);
    }
    
    // Parse filters JSON
    if (filtersStr && filtersStr.trim()) {
      filters = JSON.parse(filtersStr);
    }
    
    return {
      specifications: specifications || [],
      filters: filters || []
    };
  } catch (error) {
    console.error('Error parsing specifications:', error.message);
    return {
      specifications: [],
      filters: []
    };
  }
}

// Function to import products from CSV
async function importProducts() {
  const products = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('products_rows.csv')
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Skip empty rows or header-like rows
          if (!row.name || !row.code || row.name === 'name') {
            return;
          }
          
          console.log(`Processing: ${row.code} - ${row.name}`);
          
          // Parse specifications and filters
          const specs = parseSpecifications(row.specifications, row.filters);
          
          const product = {
            id: row.id || uuidv4(),
            code: row.code,
            type: row.type || 'accessory',
            category: row.category || 'accessories',
            name: row.name,
            description: row.description || '',
            specifications: specs,
            photo_url: row.photo_url || null,
            datasheet_url: row.datasheet_url || null,
            created_at: row.created_at || null,
            updated_at: row.updated_at || null
          };
          
          products.push(product);
          
        } catch (error) {
          console.error('Error processing row:', error.message, row.code || 'unknown');
        }
      })
      .on('end', () => {
        console.log(`Parsed ${products.length} products from CSV`);
        resolve(products);
      })
      .on('error', reject);
  });
}

// Function to insert products into database
async function insertProducts(products) {
  let successful = 0;
  let failed = 0;
  
  for (const product of products) {
    try {
      console.log(`Inserting: ${product.code} - ${product.name}`);
      
      // Check if product already exists
      const existingProduct = await pool.query(
        'SELECT id FROM products WHERE code = $1',
        [product.code]
      );
      
      if (existingProduct.rows.length > 0) {
        console.log(`⚠ Product ${product.code} already exists, skipping`);
        continue;
      }
      
      await pool.query(
        `INSERT INTO products (id, code, type, category, name, description, specifications, photo_url, datasheet_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10::timestamp, NOW()), COALESCE($11::timestamp, NOW()))`,
        [
          product.id,
          product.code,
          product.type,
          product.category,
          product.name,
          product.description,
          JSON.stringify(product.specifications),
          product.photo_url,
          product.datasheet_url,
          product.created_at,
          product.updated_at
        ]
      );
      
      console.log(`✓ Successfully inserted: ${product.code}`);
      successful++;
      
    } catch (error) {
      console.error(`✗ Failed to insert ${product.code}:`, error.message);
      failed++;
    }
  }
  
  return { successful, failed };
}

// Main function
async function main() {
  try {
    console.log('Starting CSV import with existing format...');
    
    // Import products from CSV
    const products = await importProducts();
    
    if (products.length === 0) {
      console.log('No products found in CSV file');
      return;
    }
    
    console.log(`\nFound ${products.length} products to import`);
    
    // Insert products into database
    const result = await insertProducts(products);
    
    console.log('\n=== Import Summary ===');
    console.log(`Successful imports: ${result.successful}`);
    console.log(`Failed imports: ${result.failed}`);
    console.log(`Total processed: ${products.length}`);
    
    // Verify final count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM products');
    console.log(`Total products in database: ${countResult.rows[0].total}`);
    
    // Show sample of imported specifications
    if (result.successful > 0) {
      console.log('\n=== Sample Product Specifications ===');
      const sampleResult = await pool.query(
        'SELECT code, name, specifications FROM products WHERE code != $1 LIMIT 2',
        ['test-test']
      );
      
      sampleResult.rows.forEach(row => {
        console.log(`\nProduct: ${row.code} - ${row.name}`);
        console.log('Specifications:', JSON.stringify(row.specifications, null, 2));
      });
    }
    
  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
main();