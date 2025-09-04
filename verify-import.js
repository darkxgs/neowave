const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_D2NaQwE5kFRo@ep-winter-unit-agudm8eu-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifyImport() {
  try {
    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM products');
    console.log('Total products in database:', countResult.rows[0].total);
    
    // Get sample products
    const sampleResult = await pool.query(
      "SELECT code, name, type, category FROM products WHERE code != 'test-test' ORDER BY code LIMIT 5"
    );
    
    console.log('\nSample products:');
    sampleResult.rows.forEach(row => {
      console.log(`- ${row.code} | ${row.name} | ${row.type} | ${row.category}`);
    });
    
    // Check specifications format for one product
    const specResult = await pool.query(
      "SELECT code, name, specifications FROM products WHERE code != 'test-test' AND specifications IS NOT NULL LIMIT 1"
    );
    
    if (specResult.rows.length > 0) {
      const product = specResult.rows[0];
      console.log(`\nSpecifications format for ${product.code}:`);
      console.log('Type:', typeof product.specifications);
      
      if (product.specifications && product.specifications.specifications) {
        console.log('✓ Has specifications array:', product.specifications.specifications.length, 'items');
        console.log('✓ Has filters array:', product.specifications.filters ? product.specifications.filters.length : 0, 'items');
        
        // Show first specification
        if (product.specifications.specifications.length > 0) {
          const firstSpec = product.specifications.specifications[0];
          console.log('First specification:');
          console.log('  Name:', firstSpec.name);
          console.log('  Options count:', firstSpec.options ? firstSpec.options.length : 0);
          if (firstSpec.options && firstSpec.options.length > 0) {
            console.log('  First option:', firstSpec.options[0]);
          }
        }
      } else {
        console.log('✗ Specifications format issue');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyImport();