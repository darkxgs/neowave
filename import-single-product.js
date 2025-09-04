const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Function to parse specifications string into JSONB
function parseSpecifications(specString) {
  if (!specString || specString.trim() === '') {
    return {};
  }

  const specs = {};
  const items = specString.split(',').map(item => item.trim());
  
  for (const item of items) {
    if (item.includes(':')) {
      const [key, ...valueParts] = item.split(':');
      const value = valueParts.join(':').trim();
      const cleanKey = key.trim().replace(/["']/g, '');
      const cleanValue = value.replace(/["']/g, '');
      
      if (cleanKey && cleanValue) {
        specs[cleanKey] = cleanValue;
      }
    } else if (item.includes('=')) {
      const [key, ...valueParts] = item.split('=');
      const value = valueParts.join('=').trim();
      const cleanKey = key.trim().replace(/["']/g, '');
      const cleanValue = value.replace(/["']/g, '');
      
      if (cleanKey && cleanValue) {
        specs[cleanKey] = cleanValue;
      }
    }
  }
  
  return specs;
}

// Function to determine category from product type
function determineCategory(type) {
  const typeMap = {
    'Transmitter': 'transmitters',
    'Receiver': 'receivers', 
    'Adapter': 'adapters',
    'Splitter': 'splitters',
    'Switch': 'switches',
    'Converter': 'converters',
    'Extender': 'extenders',
    'Cable': 'cables',
    'Accessory': 'accessories'
  };
  
  return typeMap[type] || 'accessories';
}

// Function to generate slug from model code
function generateSlug(modelCode) {
  return modelCode.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// Function to import a single product
async function importSingleProduct(productCode) {
  const client = await pool.connect();
  
  try {
    console.log(`\n=== Importing product: ${productCode} ===`);
    
    // Read and parse CSV to find the specific product
    const products = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream('all_products-specifications-2025-08-02-_1_.csv')
        .pipe(csv())
        .on('data', (row) => {
          if (row['Model Code'] === productCode) {
            products.push(row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    if (products.length === 0) {
      console.log(`❌ Product ${productCode} not found in CSV`);
      return false;
    }
    
    const product = products[0];
    console.log(`📦 Found product: ${product['Model Name']}`);
    console.log(`📋 Type: ${product['Type']}`);
    console.log(`📝 Description: ${product['Description']?.substring(0, 100)}...`);
    
    // Parse specifications
    const specifications = parseSpecifications(product['Available Specifications']);
    const specCount = Object.keys(specifications).length;
    console.log(`🔧 Parsed ${specCount} specifications`);
    
    if (specCount > 0) {
      console.log(`📊 Sample specs:`, Object.keys(specifications).slice(0, 3));
    }
    
    // Determine category
    const category = determineCategory(product['Type']);
    
    console.log(`🏷️  Category: ${category}`);
    
    // Check if product already exists
    const existingProduct = await client.query(
      'SELECT id FROM products WHERE code = $1',
      [product['Model Code']]
    );
    
    let result;
    if (existingProduct.rows.length > 0) {
      console.log(`🔄 Updating existing product...`);
      result = await client.query(
        `UPDATE products 
         SET name = $2, description = $3, category = $4, specifications = $5, updated_at = NOW()
         WHERE code = $1 
         RETURNING id`,
        [
          product['Model Code'],
          product['Model Name'],
          product['Description'] || '',
          category,
          JSON.stringify(specifications)
        ]
      );
      console.log(`✅ Product updated successfully (ID: ${result.rows[0].id})`);
    } else {
      console.log(`➕ Inserting new product...`);
      const productId = uuidv4();
      result = await client.query(
        `INSERT INTO products (id, code, name, description, category, specifications, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING id`,
        [
          productId,
          product['Model Code'],
          product['Model Name'],
          product['Description'] || '',
          category,
          JSON.stringify(specifications)
        ]
      );
      console.log(`✅ Product inserted successfully (ID: ${result.rows[0].id})`);
    }
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error importing product ${productCode}:`, error.message);
    console.error(`🔍 Error details:`, error);
    return false;
  } finally {
    client.release();
  }
}

// Main function
async function main() {
  const productCode = process.argv[2];
  
  if (!productCode) {
    console.error('❌ Please provide a product code as argument');
    console.log('Usage: node import-single-product.js <PRODUCT_CODE>');
    process.exit(1);
  }
  
  console.log(`🚀 Starting import for product: ${productCode}`);
  
  try {
    const success = await importSingleProduct(productCode);
    
    if (success) {
      console.log(`\n🎉 Successfully imported product: ${productCode}`);
    } else {
      console.log(`\n💥 Failed to import product: ${productCode}`);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { importSingleProduct };