const fs = require('fs');
const path = require('path');

// Files to remove
const filesToRemove = [
  'bun.lockb',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
];

console.log('Cleaning lock files before build...');

filesToRemove.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed ${file}`);
    } catch (err) {
      console.error(`❌ Failed to remove ${file}:`, err);
    }
  } else {
    console.log(`⏭️ ${file} does not exist, skipping`);
  }
});

console.log('Clean-up completed!'); 