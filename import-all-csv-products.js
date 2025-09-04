const { Pool } = require('pg');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Database connection
const DATABASE_URL = 'postgresql://neondb_owner:npg_D2NaQwE5kFRo@ep-winter-unit-agudm8eu-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Function to parse CSV specifications into the required JSON format
function parseSpecifications(specString) {
  if (!specString || specString.trim() === '') {
    return {
      filters: [],
      specifications: []
    };
  }

  const specifications = [];
  const parts = specString.split(' | ');
  
  parts.forEach(part => {
    const [name, values] = part.split(': ');
    if (name && values) {
      const options = values.split(', ').map(value => {
        // Handle cases like "2=2000ppm" or "V5=0-5V"
        const [code, label] = value.includes('=') ? value.split('=') : [value, value];
        return {
          code: code.trim(),
          label: label ? label.trim() : code.trim(),
          value: label ? label.trim() : code.trim()
        };
      });
      
      specifications.push({
        name: name.trim(),
        options: options
      });
    }
  });

  return {
    filters: [],
    specifications: specifications
  };
}

// Function to map product type to category
function mapTypeToCategory(type) {
  const categoryMap = {
    'Air Quality': 'accessories',
    'Pressure (Air & Liquid)': 'accessories',
    'Level Measuring': 'accessories',
    'Flow sensors (Air & liquid)': 'accessories',
    'Smart Thermostat': 'hvac-control',
    'Temperature and humidity': 'accessories'
  };
  return categoryMap[type] || 'accessories';
}

// Read and parse CSV file
function readCSV() {
  const csvContent = fs.readFileSync('C:\\Users\\Dark\\Downloads\\neowave-main\\all_products-specifications-2025-08-02-_1_.csv', 'utf8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  
  const products = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    // Parse CSV line handling quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim()); // Add the last field
    
    if (fields.length >= 5) {
      const product = {
        code: fields[0],
        name: fields[1],
        type: fields[2],
        description: fields[3],
        specifications: fields[4]
      };
      products.push(product);
    }
  }
  
  return products;
}

// Insert product into database
async function insertProduct(product) {
  const productId = uuidv4();
  const category = mapTypeToCategory(product.type);
  const specifications = parseSpecifications(product.specifications);
  
  const query = `
    INSERT INTO products (id, code, name, type, description, category, specifications, photo_url, datasheet_url, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
  `;
  
  const values = [
    productId,
    product.code,
    product.name,
    product.type,
    product.description,
    category,
    JSON.stringify(specifications),
    '', // photo_url
    '' // datasheet_url
  ];
  
  try {
    await pool.query(query, values);
    console.log(`✓ Imported: ${product.code} - ${product.name}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to import ${product.code}:`, error.message);
    return false;
  }
}

// Main import function
async function importAllProducts() {
  try {
    console.log('Starting CSV import...');
    
    // First, clear existing products except the test one
    await pool.query("DELETE FROM products WHERE code != 'test-test'");
    console.log('Cleared existing products (except test product)');
    
    const products = readCSV();
    console.log(`Found ${products.length} products in CSV`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const product of products) {
      const success = await insertProduct(product);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    console.log(`\nImport completed:`);
    console.log(`✓ Successfully imported: ${successCount} products`);
    console.log(`✗ Failed to import: ${failCount} products`);
    
    // Verify final count
    const result = await pool.query('SELECT COUNT(*) as total FROM products');
    console.log(`Total products in database: ${result.rows[0].total}`);
    
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
importAllProducts();