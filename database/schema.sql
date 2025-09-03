-- Neon.tech PostgreSQL Schema for Neowave Application
-- This schema replaces the Vercel KV data structure

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
-- Replaces the KV store pattern: product:{id}
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    description TEXT,
    specifications JSONB,
    photo_url TEXT,
    datasheet_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
-- Replaces the KV store key: product_categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    types JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Filters table
-- Replaces the KV store key: product_filters
CREATE TABLE IF NOT EXISTS filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filter_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'category', 'specification', etc.
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table (if needed for authentication)
-- Replaces KV store session management
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL UNIQUE,
    user_data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_categories_category_id ON categories(category_id);
CREATE INDEX IF NOT EXISTS idx_filters_filter_id ON filters(filter_id);
CREATE INDEX IF NOT EXISTS idx_filters_type ON filters(type);

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update the updated_at column
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_filters_updated_at BEFORE UPDATE ON filters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories (matching the current application structure)
INSERT INTO categories (category_id, name, types) VALUES
('io-modules', 'I/O modules and data transmission', 
 '[{"id": "industrial-switches", "name": "Industrial switches"}, {"id": "io-modules", "name": "I/O modules"}]'::jsonb),
('sensors-switches', 'Sensors and Switches', 
 '[{"id": "temp-humid", "name": "Temperature and humidity"}, {"id": "air-quality", "name": "Air Quality"}, {"id": "pressure", "name": "Pressure (Air & liquid)"}, {"id": "level", "name": "Level Measuring"}, {"id": "flow", "name": "Flow sensors (Air & liquid)"}]'::jsonb),
('hvac-control', 'HVAC control', 
 '[{"id": "smart-thermostat", "name": "Smart Thermostat"}, {"id": "damper-actuators", "name": "Damper Actuators"}]'::jsonb),
('power-energy', 'Power & Energy', 
 '[{"id": "btu-meters", "name": "BTU Meters"}, {"id": "water-meters", "name": "Water Meters"}]'::jsonb),
('life-safety', 'Life Safety Systems', 
 '[{"id": "fire-alarm", "name": "Fire Alarm Systems"}, {"id": "gas-detectors", "name": "LPG & Natural Gas Detectors"}]'::jsonb)
ON CONFLICT (category_id) DO NOTHING;

-- Clean up expired sessions (optional maintenance)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;