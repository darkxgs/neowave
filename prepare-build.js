const fs = require('fs');
const path = require('path');

// Run this before the Next.js build to prepare the directory structure
console.log('Preparing app directory structure...');

function copyFolderRecursiveSync(source, target) {
  // Check if folder needs to be created or integrated
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  // Copy files
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        // Skip route groups
        if (file.startsWith('(') && file.endsWith(')')) {
          console.log(`🔄 Processing route group: ${file}`);
          // Instead of copying the route group, process its contents
          const routeGroupFiles = fs.readdirSync(curSource);
          routeGroupFiles.forEach(function (rgFile) {
            const rgSource = path.join(curSource, rgFile);
            // For folders inside route groups, we want to flatten them
            if (fs.lstatSync(rgSource).isDirectory()) {
              // Create a flattened path by combining group name and folder name
              const flattenedTarget = path.join(target, rgFile);
              copyFolderRecursiveSync(rgSource, flattenedTarget);
            } else {
              // For files directly in route groups, just copy them to target
              const rgTarget = path.join(target, rgFile);
              fs.copyFileSync(rgSource, rgTarget);
            }
          });
        } else {
          // Regular folder, copy recursively
          copyFolderRecursiveSync(curSource, curTarget);
        }
      } else {
        // Check if the file is a page.tsx to make a naming detection
        if (file === 'page.tsx' && path.basename(source).startsWith('(') && path.basename(source).endsWith(')')) {
          // This is a page in a route group - we need to be careful
          console.log(`⚠️ Found page in route group: ${source}`);
          // We'll still copy it, but monitor for conflicts
          fs.copyFileSync(curSource, curTarget);
        } else {
          // Regular file, just copy
          fs.copyFileSync(curSource, curTarget);
        }
      }
    });
  }
}

try {
  // First, check if we have route groups by scanning the app directory
  const appDir = path.join(__dirname, 'app');
  
  if (fs.existsSync(appDir)) {
    // Create a temporary directory to hold our restructured app
    const tempDir = path.join(__dirname, 'app_temp');
    if (fs.existsSync(tempDir)) {
      // Remove existing temp directory to start fresh
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Copy all files from app to app_temp, processing route groups
    copyFolderRecursiveSync(appDir, tempDir);
    
    // Now rename app to app_original and app_temp to app
    const appOriginalDir = path.join(__dirname, 'app_original');
    if (fs.existsSync(appOriginalDir)) {
      fs.rmSync(appOriginalDir, { recursive: true, force: true });
    }
    
    // Rename app to app_original
    fs.renameSync(appDir, appOriginalDir);
    
    // Rename app_temp to app
    fs.renameSync(tempDir, appDir);
    
    console.log('✅ App directory restructured successfully!');
  } else {
    console.log('⚠️ App directory not found - nothing to restructure');
  }
} catch (error) {
  console.error('❌ Error restructuring app directory:', error);
}

console.log('App directory preparation completed!'); 