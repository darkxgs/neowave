const fs = require('fs');
const path = require('path');

console.log('Fixing route conflicts...');

// Files to remove (conflicting routes)
const conflictingFiles = [
  'app/(auth)/login/page.tsx',
  'app/(main)/login/page.tsx'
];

// Ensure we only have one login route
conflictingFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Removed conflicting route: ${file}`);
    } catch (err) {
      console.error(`❌ Failed to remove ${file}:`, err);
    }
  } else {
    console.log(`⏭️ ${file} does not exist, skipping`);
  }
});

console.log('Route conflicts fixed!'); 