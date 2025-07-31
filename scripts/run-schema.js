#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('📋 Database Schema Setup Instructions')
console.log('=====================================')
console.log('')
console.log('To set up your Supabase database:')
console.log('')
console.log('1. Go to your Supabase dashboard:')
console.log('   https://supabase.com/dashboard/project/lttpegiinnbnafwcscjb')
console.log('')
console.log('2. Navigate to the SQL Editor')
console.log('')
console.log('3. Copy and paste the following SQL schema:')
console.log('')

// Read and display the schema
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
try {
  const schema = fs.readFileSync(schemaPath, 'utf8')
  console.log('--- COPY FROM HERE ---')
  console.log(schema)
  console.log('--- COPY TO HERE ---')
} catch (error) {
  console.error('❌ Error reading schema file:', error.message)
  console.log('Please manually copy the contents of database/schema.sql')
}

console.log('')
console.log('4. Click "Run" to execute the SQL')
console.log('')
console.log('5. Verify the tables were created in the Table Editor')
console.log('')
console.log('✅ After setup, you can run: npm run dev')
console.log('')