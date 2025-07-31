import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that need elevated permissions
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface Product {
  id: string
  category: string
  type: string
  name: string
  code: string
  datasheet_url?: string
  photo_url?: string
  specifications: any[]
  filters: string[]
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  types: any[]
  created_at: string
  updated_at: string
}

export interface ProductFilter {
  id: string
  name: string
  type_id: string
  predefined: boolean
  created_at: string
  updated_at: string
}

export interface UserSession {
  id: string
  token: string
  username: string
  expires_at: string
  created_at: string
}