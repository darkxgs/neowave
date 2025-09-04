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

// Function to parse CSV specifications into proper format
function parseSpecifications(csvRow) {
  const specifications = [];
  const filters = [];
  
  // Define specification mappings based on CSV columns
  const specMappings = {
    'Type': 'type',
    'Category': 'category',
    'Power Supply': 'power_supply',
    'Operating Temperature': 'operating_temperature',
    'Humidity Range': 'humidity_range',
    'Dimensions': 'dimensions',
    'Weight': 'weight',
    'Material': 'material',
    'Color': 'color',
    'Mounting': 'mounting',
    'Connectivity': 'connectivity',
    'Protocol': 'protocol',
    'Range': 'range',
    'Accuracy': 'accuracy',
    'Resolution': 'resolution',
    'Output': 'output',
    'Input': 'input',
    'Display': 'display',
    'Interface': 'interface',
    'Certification': 'certification',
    'Warranty': 'warranty'
  };
  
  // Process each column that could be a specification
  Object.keys(csvRow).forEach(key => {
    const value = csvRow[key];
    if (value && value.trim() && !['Code', 'Name', 'Description', 'Photo URL', 'Datasheet URL'].includes(key)) {
      // Create specification with options
      const specName = specMappings[key] || key.toLowerCase().replace(/\s+/g, '_');
      
      // Split value by common delimiters to create options
      const optionValues = value.split(/[,;|]/).map(v => v.trim()).filter(v => v);
      
      const options = optionValues.map((optionValue, index) => {
        // Generate code from option value
        let code = optionValue.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 20);
        
        if (!code) {
          code = `opt${index + 1}`;
        }
        
        return {
          code: code,
          label: optionValue,
          value: optionValue
        };
      });
      
      specifications.push({
        name: specName,
        options: options
      });
    }
  });
  
  return {
    specifications: specifications,
    filters: filters
  };
}

// Function to map product type to category
function mapTypeToCategory(type) {
  const categoryMap = {
    'smart-thermostat': 'thermostats',
    'temperature-sensor': 'sensors',
    'humidity-sensor': 'sensors',
    'pressure-sensor': 'sensors',
    'flow-sensor': 'sensors',
    'level-sensor': 'sensors',
    'valve': 'valves',
    'actuator': 'actuators',
    'controller': 'controllers',
    'display': 'displays',
    'adapter': 'accessories',
    'cable': 'accessories',
    'mounting': 'accessories'
  };
  
  return categoryMap[type] || 'accessories';
}

// Function to generate product code
function generateProductCode(name, specifications) {
  // Handle missing name
  if (!name || typeof name !== 'string') {
    name = 'product';
  }
  
  // Start with the name
  let code = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  
  // Add first option code from each specification
  if (specifications && specifications.specifications) {
    specifications.specifications.forEach(spec => {
      if (spec.options && spec.options.length > 0) {
        const firstOptionCode = spec.options[0].code;
        if (firstOptionCode && firstOptionCode !== code) {
          code += '-' + firstOptionCode;
        }
      }
    });
  }
  
  return code.substring(0, 50); // Limit length
}

// Function to import products from CSV
async function importProducts() {
  const products = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('products_rows.csv')
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Skip empty rows
          if (!row.Name && !row.Code) {
            return;
          }
          
          console.log('Processing row:', row.Name || row.Code || 'unnamed');
          
          // Parse specifications
          const specifications = parseSpecifications(row);
          
          // Determine type and category
          const type = row.Type || 'accessory';
          const category = mapTypeToCategory(type);
          
          // Use existing code or generate new one
          const code = row.Code || generateProductCode(row.Name, specifications);
          
          const product = {
            id: uuidv4(),
            code: code,
            type: type,
            category: category,
            name: row.Name || '',
            description: row.Description || '',
            specifications: specifications,
            photo_url: row['Photo URL'] || null,
            datasheet_url: row['Datasheet URL'] || null
          };
          
          products.push(product);
        } catch (error) {
          console.error('Error processing row:', error.message, row);
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
      console.log(`Inserting product: ${product.code} - ${product.name}`);
      
      await pool.query(
        `INSERT INTO products (id, code, type, category, name, description, specifications, photo_url, datasheet_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
        [
          product.id,
          product.code,
          product.type,
          product.category,
          product.name,
          product.description,
          JSON.stringify(product.specifications),
          product.photo_url,
          product.datasheet_url
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
    console.log('Starting CSV import with correct format...');
    
    // Clear existing products except test-test
    console.log('Clearing existing CSV products...');
    const deleteResult = await pool.query("DELETE FROM products WHERE code != 'test-test'");
    console.log(`Cleared ${deleteResult.rowCount} existing products`);
    
    // Import products from CSV
    const products = await importProducts();
    
    if (products.length === 0) {
      console.log('No products found in CSV file');
      return;
    }
    
    // Insert products into database
    const result = await insertProducts(products);
    
    console.log('\n=== Import Summary ===');
    console.log(`Successful imports: ${result.successful}`);
    console.log(`Failed imports: ${result.failed}`);
    console.log(`Total processed: ${products.length}`);
    
    // Verify final count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM products');
    console.log(`Total products in database: ${countResult.rows[0].total}`);
    
  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    await pool.end();
  }
}

// Run the import
main();