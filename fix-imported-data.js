const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Database connection using the correct connection string
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_D2NaQwE5kFRo@ep-winter-unit-agudm8eu-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Function to convert flat specifications to proper format
function convertSpecifications(flatSpecs) {
  if (!flatSpecs || typeof flatSpecs !== 'object') {
    return {
      specifications: [],
      filters: []
    };
  }

  const specifications = [];
  
  // Convert each key-value pair to a specification with options
  for (const [key, value] of Object.entries(flatSpecs)) {
    if (key && value && typeof value === 'string') {
      // Split the value by commas to create multiple options
      const optionValues = value.split(',').map(v => v.trim()).filter(v => v);
      
      const options = optionValues.map((optionValue, index) => {
        // Extract code and label from option value
        let code, label;
        
        if (optionValue.includes('=')) {
          // Format: "code=description"
          const [optCode, ...rest] = optionValue.split('=');
          code = optCode.trim();
          label = rest.join('=').trim();
        } else {
          // Simple value, use as both code and label
          code = optionValue;
          label = optionValue;
        }
        
        return {
          code: code || `opt${index + 1}`,
          label: label || optionValue,
          value: optionValue
        };
      });
      
      specifications.push({
        name: key,
        options: options
      });
    }
  }
  
  return {
    specifications: specifications,
    filters: []
  };
}

// Function to fix all products
async function fixAllProducts() {
  try {
    console.log('Fetching all products with flat specifications...');
    
    // Get all products except test-test
    const result = await pool.query(
      "SELECT id, code, name, specifications FROM products WHERE code != 'test-test'"
    );
    
    console.log(`Found ${result.rows.length} products to fix`);
    
    let fixed = 0;
    let errors = 0;
    
    for (const product of result.rows) {
      try {
        console.log(`\nFixing product: ${product.code} - ${product.name}`);
        
        // Parse current specifications
        let currentSpecs = product.specifications;
        if (typeof currentSpecs === 'string') {
          currentSpecs = JSON.parse(currentSpecs);
        }
        
        console.log('Current specs:', JSON.stringify(currentSpecs, null, 2));
        
        // Check if already in correct format
        if (currentSpecs && currentSpecs.specifications && Array.isArray(currentSpecs.specifications)) {
          console.log('✓ Already in correct format, skipping');
          continue;
        }
        
        // Convert to proper format
        const newSpecs = convertSpecifications(currentSpecs);
        console.log('New specs:', JSON.stringify(newSpecs, null, 2));
        
        // Update the product
        await pool.query(
          'UPDATE products SET specifications = $1, updated_at = NOW() WHERE id = $2',
          [JSON.stringify(newSpecs), product.id]
        );
        
        console.log('✓ Fixed successfully');
        fixed++;
        
      } catch (error) {
        console.error(`✗ Error fixing product ${product.code}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Fixed: ${fixed} products`);
    console.log(`Errors: ${errors} products`);
    console.log(`Total processed: ${result.rows.length} products`);
    
  } catch (error) {
    console.error('Error in fixAllProducts:', error);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixAllProducts();