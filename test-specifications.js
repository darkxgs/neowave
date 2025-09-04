const { Pool } = require('pg');

async function testSpecifications() {
  const DATABASE_URL = "postgresql://neondb_owner:npg_D2NaQwE5kFRo@ep-winter-unit-agudm8eu-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Testing product specifications...');
    
    // Check all products and their specifications
    const result = await pool.query(`
      SELECT code, name, specifications 
      FROM products 
      ORDER BY code
    `);
    
    console.log(`\nFound ${result.rows.length} total products`);
    
    let emptySpecsCount = 0;
    let invalidSpecsCount = 0;
    
    result.rows.forEach(product => {
      const specs = product.specifications;
      
      if (!specs) {
        console.log(`❌ ${product.code}: No specifications`);
        emptySpecsCount++;
      } else if (typeof specs === 'object') {
        if (!specs.specifications || !Array.isArray(specs.specifications) || specs.specifications.length === 0) {
          console.log(`⚠️  ${product.code}: Empty specifications array`);
          emptySpecsCount++;
        } else {
          // Check if specifications have valid structure
          const hasValidSpecs = specs.specifications.every(spec => 
            spec.name && spec.options && Array.isArray(spec.options) && spec.options.length > 0
          );
          
          if (!hasValidSpecs) {
            console.log(`⚠️  ${product.code}: Invalid specification structure`);
            invalidSpecsCount++;
          } else {
            console.log(`✅ ${product.code}: Valid specifications (${specs.specifications.length} specs)`);
          }
        }
      } else {
        console.log(`❌ ${product.code}: Invalid specifications type: ${typeof specs}`);
        invalidSpecsCount++;
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`Total products: ${result.rows.length}`);
    console.log(`Products with empty specifications: ${emptySpecsCount}`);
    console.log(`Products with invalid specifications: ${invalidSpecsCount}`);
    console.log(`Products with valid specifications: ${result.rows.length - emptySpecsCount - invalidSpecsCount}`);
    
    // Specifically check TxTH05
    console.log(`\n🔍 Checking TxTH05 specifically:`);
    const txth05 = result.rows.find(p => p.code.includes('TxTH05'));
    if (txth05) {
      console.log(`Found: ${txth05.code}`);
      console.log(`Name: ${txth05.name}`);
      console.log(`Specifications:`, JSON.stringify(txth05.specifications, null, 2));
    } else {
      console.log(`TxTH05 not found in database`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testSpecifications();