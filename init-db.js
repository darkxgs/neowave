const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

async function initializeDatabase() {
  const DATABASE_URL = "postgresql://neondb_owner:npg_D2NaQwE5kFRo@ep-winter-unit-agudm8eu-pooler.c-2.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    console.log('Connecting to database...')
    const client = await pool.connect()
    
    console.log('Reading schema file...')
    const schemaPath = path.join(__dirname, 'database', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('Executing schema...')
    await client.query(schema)
    
    console.log('Database schema initialized successfully!')
    client.release()
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initializeDatabase()