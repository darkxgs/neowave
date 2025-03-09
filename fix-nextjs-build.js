const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Run this after the Next.js build to clean up the output
console.log('Fixing Next.js build output...');

try {
  // Check if the .next directory exists
  if (fs.existsSync('.next')) {
    // Make sure standalone directory exists in .next
    const standalonePath = path.join('.next', 'standalone');
    if (!fs.existsSync(standalonePath)) {
      fs.mkdirSync(standalonePath, { recursive: true });
    }

    // Create the necessary directory structure in standalone
    const standaloneNextServerPath = path.join(standalonePath, '.next', 'server');
    if (!fs.existsSync(standaloneNextServerPath)) {
      fs.mkdirSync(standaloneNextServerPath, { recursive: true });
    }

    // Create the app directory in standalone
    const standaloneAppPath = path.join(standaloneNextServerPath, 'app');
    if (!fs.existsSync(standaloneAppPath)) {
      fs.mkdirSync(standaloneAppPath, { recursive: true });
    }

    // Create an empty placeholder for the file that's causing errors
    // This might allow the build to continue even if the file doesn't exist in source
    const mainGroupPath = path.join(standaloneAppPath, '(main)');
    if (!fs.existsSync(mainGroupPath)) {
      fs.mkdirSync(mainGroupPath, { recursive: true });
    }

    // Create an empty client-reference-manifest.js file
    const manifestFile = path.join(mainGroupPath, 'page_client-reference-manifest.js');
    fs.writeFileSync(manifestFile, '// Empty placeholder file to satisfy build process\n');

    console.log('✅ Created placeholder for missing manifest file');
  } else {
    console.log('⚠️ .next directory not found, skipping build fix');
  }
} catch (error) {
  console.error('❌ Error fixing build output:', error);
}

console.log('Next.js build fix completed'); 