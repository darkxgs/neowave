const fs = require('fs');
const path = require('path');

console.log('Fixing route conflicts and directory structure...');

// Files to remove (conflicting routes)
const conflictingFiles = [
  'app/(auth)/login/page.tsx',
  'app/(main)/login/page.tsx'
];

// Files to move/flatten
const filesToFlatten = [
  { 
    from: 'app/(auth)/admin-login/page.tsx', 
    to: 'app/admin-login/page.tsx' 
  },
  { 
    from: 'app/(main)/user-login/page.tsx', 
    to: 'app/user-login/page.tsx' 
  }
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

// Flatten directory structure
filesToFlatten.forEach(({from, to}) => {
  const fromPath = path.join(__dirname, from);
  const toPath = path.join(__dirname, to);
  
  // Create directory if it doesn't exist
  const dir = path.dirname(toPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (fs.existsSync(fromPath)) {
    try {
      // Copy the file content
      fs.copyFileSync(fromPath, toPath);
      console.log(`✅ Copied from ${from} to ${to}`);
      
      // Delete the original file
      fs.unlinkSync(fromPath);
      console.log(`✅ Removed original: ${from}`);
    } catch (err) {
      console.error(`❌ Failed to copy/remove ${from}:`, err);
    }
  } else {
    console.log(`⏭️ ${from} does not exist, skipping`);
  }
});

console.log('Route conflicts and directory structure fixed!'); 