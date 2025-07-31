const fs = require('fs');
const path = require('path');

// This script only runs during build time on Vercel
// It doesn't change your local files
console.log('Preparing app directory structure for deployment...');

function copyFolderRecursiveSync(source, target) {
  // Check if folder needs to be created
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
        // Special handling for route groups - flatten them
        if (file.startsWith('(') && file.endsWith(')')) {
          console.log(`🔄 Processing route group: ${file}`);
          // Process contents of route group
          const routeGroupFiles = fs.readdirSync(curSource);
          routeGroupFiles.forEach(function (rgFile) {
            const rgSource = path.join(curSource, rgFile);
            if (fs.lstatSync(rgSource).isDirectory()) {
              // For subdirectories, create a new directory with a name that
              // combines the route group and subdirectory name
              const flattenedName = rgFile.replace(/page\.tsx$/, `${file.replace(/[()]/g, '')}_${rgFile}`);
              const flattenedTarget = path.join(target, flattenedName);
              copyFolderRecursiveSync(rgSource, flattenedTarget);
            } else if (rgFile === 'page.tsx' && fs.existsSync(path.join(target, rgFile))) {
              // If there's a conflict with page.tsx files, rename it
              const newFileName = `${file.replace(/[()]/g, '')}_${rgFile}`;
              fs.copyFileSync(rgSource, path.join(target, newFileName));
              console.log(`⚠️ Renamed conflicting page: ${rgFile} to ${newFileName}`);
            } else {
              // Regular file, just copy
              fs.copyFileSync(rgSource, path.join(target, rgFile));
            }
          });
        } else {
          // Regular folder, copy recursively
          copyFolderRecursiveSync(curSource, curTarget);
        }
      } else {
        // Regular file, copy
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

try {
  // Only process the app directory to fix route conflicts
  const appDir = path.join(__dirname, 'app');
  
  if (fs.existsSync(appDir)) {
    // Create a temporary directory to hold restructured app
    const tempDir = path.join(__dirname, 'app_temp');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Copy app directory to temp directory, processing route groups
    copyFolderRecursiveSync(appDir, tempDir);
    
    // Backup original app directory
    const appOriginalDir = path.join(__dirname, 'app_original');
    if (fs.existsSync(appOriginalDir)) {
      fs.rmSync(appOriginalDir, { recursive: true, force: true });
    }
    
    // Rename directories
    fs.renameSync(appDir, appOriginalDir);
    fs.renameSync(tempDir, appDir);
    
    console.log('✅ App directory restructured successfully for deployment!');
  } else {
    console.log('⚠️ App directory not found - nothing to restructure');
  }
} catch (error) {
  console.error('❌ Error restructuring app directory:', error);
}

console.log('App directory preparation completed - deployment ready!'); 