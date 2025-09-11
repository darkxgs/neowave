import { Pool, PoolClient, QueryResult } from 'pg'
import fs from 'fs'
import path from 'path'

// Database connection pool
let pool: Pool | null = null

// Initialize the database connection pool
function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false // Required for Neon.tech
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    })

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }
  
  return pool
}

// Execute a query with automatic connection management
export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    const result = await client.query<T>(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Execute multiple queries in a transaction
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Transaction error:', error)
    throw error
  } finally {
    client.release()
  }
}

// Initialize database schema
export async function initializeDatabase(): Promise<void> {
  try {
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
    
    if (!fs.existsSync(schemaPath)) {
      console.warn('Schema file not found at:', schemaPath)
      return
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8')
    await query(schema)
    console.log('Database schema initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database schema:', error)
    throw error
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as current_time')
    console.log('Database connection successful:', result.rows[0])
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Close the database pool (useful for cleanup)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log('Database pool closed')
  }
}

// Helper function to handle database errors consistently
export function handleDatabaseError(error: any, operation: string): never {
  console.error(`Database error during ${operation}:`, error)
  
  if (error.code === 'ECONNREFUSED') {
    throw new Error(`Database connection refused during ${operation}. Please check your database configuration.`)
  } else if (error.code === 'ENOTFOUND') {
    throw new Error(`Database host not found during ${operation}. Please check your DATABASE_URL.`)
  } else if (error.code === '28P01') {
    throw new Error(`Database authentication failed during ${operation}. Please check your credentials.`)
  } else if (error.code === '3D000') {
    throw new Error(`Database does not exist during ${operation}. Please check your database name.`)
  } else {
    throw new Error(`Database error during ${operation}: ${error.message || 'Unknown error'}`)
  }
}

// Product-specific database operations
export const productDb = {
  async getAll() {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC')
    return result.rows
  },
  
  async getById(id: string) {
    const result = await query('SELECT * FROM products WHERE id = $1', [id])
    return result.rows[0] || null
  },
  
  async create(productData: any) {
    const { code, type, category, name, description, specifications, filters, photo_url, datasheet_url } = productData
    
    // Generate a unique ID if not provided
    const id = productData.id || `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Combine specifications and filters into the specifications JSONB field
    const specsWithFilters = {
      specifications: specifications || [],
      filters: filters || []
    }
    
    const result = await query(
      `INSERT INTO products (id, code, type, category, name, description, specifications, photo_url, datasheet_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [id, code, type, category, name, description, JSON.stringify(specsWithFilters), photo_url, datasheet_url]
    )
    return result.rows[0]
  },
  
  async update(id: string, productData: any) {
    const { code, type, category, name, description, specifications, filters, photoUrl, datasheetUrl } = productData
    
    // Combine specifications and filters into the specifications JSONB field (same as create)
    const specsWithFilters = {
      specifications: specifications || [],
      filters: filters || []
    }
    
    const result = await query(
      `UPDATE products 
       SET code = $2, type = $3, category = $4, name = $5, description = $6, 
           specifications = $7, photo_url = $8, datasheet_url = $9, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id, code, type, category, name, description, JSON.stringify(specsWithFilters), photoUrl, datasheetUrl]
    )
    return result.rows[0]
  },
  
  async delete(id: string) {
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id])
    return result.rows[0]
  }
}

// Category-specific database operations
export const categoryDb = {
  async getAll() {
    const result = await query('SELECT * FROM categories ORDER BY name')
    return result.rows.map(row => ({
      id: row.category_id,
      name: row.name,
      types: row.types
    }))
  },
  
  async set(categories: any[]) {
    return await transaction(async (client) => {
      // Clear existing categories
      await client.query('DELETE FROM categories')
      
      // Insert new categories
      for (const category of categories) {
        await client.query(
          'INSERT INTO categories (category_id, name, types) VALUES ($1, $2, $3)',
          [category.id, category.name, JSON.stringify(category.types)]
        )
      }
      
      return categories
    })
  }
}

// Session-specific database operations
export const sessionDb = {
  async get(sessionId: string) {
    const result = await query('SELECT * FROM user_sessions WHERE session_id = $1', [sessionId])
    return result.rows[0] || null
  },
  
  async set(sessionId: string, sessionData: any) {
    const result = await query(
      `INSERT INTO user_sessions (session_id, user_data, expires_at) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (session_id) 
       DO UPDATE SET user_data = $2, expires_at = $3, updated_at = NOW() 
       RETURNING *`,
      [sessionId, JSON.stringify(sessionData), new Date(Date.now() + 24 * 60 * 60 * 1000)] // 24 hours from now
    )
    return result.rows[0]
  },
  
  async delete(sessionId: string) {
    const result = await query('DELETE FROM user_sessions WHERE session_id = $1 RETURNING *', [sessionId])
    return result.rows[0]
  },
  
  async create(sessionId: string, sessionData: any) {
    return await this.set(sessionId, sessionData)
  }
}

// Filter-specific database operations
export const filterDb = {
  async getAll() {
    const result = await query('SELECT * FROM filters ORDER BY name')
    return result.rows.map(row => ({
      id: row.filter_id,
      name: row.name,
      typeId: row.type,
      options: row.options
    }))
  },
  
  async add(filter: any) {
    const result = await query(
      'INSERT INTO filters (filter_id, name, type, options) VALUES ($1, $2, $3, $4) RETURNING *',
      [filter.id, filter.name, filter.typeId || filter.type, JSON.stringify(filter.options || [])]
    )
    return {
      id: result.rows[0].filter_id,
      name: result.rows[0].name,
      typeId: result.rows[0].type,
      options: result.rows[0].options
    }
  },

  async create(filter: any) {
    return await this.add(filter)
  },
  
  async delete(filterId: string) {
    const result = await query('DELETE FROM filters WHERE filter_id = $1 RETURNING *', [filterId])
    return result.rows[0]
  }
}