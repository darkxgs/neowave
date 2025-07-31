const { execSync } = require('child_process')
const path = require('path')

console.log('🚀 Initializing development data...')

try {
  // Run the initialization
  execSync('node -e "require(\'./lib/init-data.ts\').initializeDefaultData()"', {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
  
  console.log('✅ Development data initialized successfully!')
} catch (error) {
  console.error('❌ Failed to initialize development data:', error.message)
  process.exit(1)
}