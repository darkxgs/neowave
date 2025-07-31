-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL UNIQUE,
  datasheet_url TEXT,
  photo_url TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  filters TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  types JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product filters table
CREATE TABLE IF NOT EXISTS product_filters (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type_id VARCHAR(255) NOT NULL,
  predefined BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table (for authentication)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_product_filters_type_id ON product_filters(type_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_filters_updated_at BEFORE UPDATE ON product_filters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO product_categories (id, name, types) VALUES
('io-modules', 'I/O modules and data transmission', '[
  {"id": "industrial-switches", "name": "Industrial switches"},
  {"id": "io-modules", "name": "I/O modules"}
]'::jsonb),
('sensors-switches', 'Sensors and Switches', '[
  {"id": "temp-humid", "name": "Temperature and humidity"},
  {"id": "air-quality", "name": "Air Quality"},
  {"id": "pressure", "name": "Pressure (Air & liquid)"},
  {"id": "level", "name": "Level Measuring"},
  {"id": "flow", "name": "Flow sensors (Air & liquid)"}
]'::jsonb),
('hvac-control', 'HVAC control', '[
  {"id": "smart-thermostat", "name": "Smart Thermostat"},
  {"id": "damper-actuators", "name": "Damper Actuators"}
]'::jsonb),
('power-energy', 'Power & Energy', '[
  {"id": "btu-meters", "name": "BTU Meters"},
  {"id": "water-meters", "name": "Water Meters"}
]'::jsonb),
('life-safety', 'Life Safety Systems', '[
  {"id": "fire-alarm", "name": "Fire Alarm Systems"},
  {"id": "gas-detectors", "name": "LPG & Natural Gas Detectors"}
]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert default filters
INSERT INTO product_filters (id, name, type_id, predefined) VALUES
('temp-humid-duct', 'Duct Mounted', 'temp-humid', true),
('temp-humid-water', 'Water Resistant', 'temp-humid', true),
('temp-humid-outdoor', 'Outdoor', 'temp-humid', true),
('temp-humid-indoor', 'Indoor', 'temp-humid', true),
('air-quality-wall', 'Wall Mounted', 'air-quality', true),
('air-quality-duct', 'Duct Mounted', 'air-quality', true),
('pressure-differential', 'Differential', 'pressure', true),
('pressure-gauge', 'Gauge', 'pressure', true)
ON CONFLICT (id) DO NOTHING;