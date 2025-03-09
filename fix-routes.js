const fs = require('fs');
const path = require('path');

console.log('Fixing route conflicts by renaming problematic files...');

// Define file paths that need to be renamed
const filesToRename = [
  {
    from: 'app/(auth)/login/page.tsx',
    to: 'app/(auth)/login/_page.tsx.bak'
  },
  {
    from: 'app/(main)/login/page.tsx',
    to: 'app/(main)/login/_page.tsx.bak'
  }
];

// Rename files
filesToRename.forEach(({ from, to }) => {
  const fromPath = path.join(process.cwd(), from);
  const toPath = path.join(process.cwd(), to);
  
  // Create directories if they don't exist
  const dir = path.dirname(toPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
  
  // Rename the file if it exists
  if (fs.existsSync(fromPath)) {
    try {
      // Make sure original directory exists
      const originalDir = path.dirname(fromPath);
      if (!fs.existsSync(originalDir)) {
        fs.mkdirSync(originalDir, { recursive: true });
        console.log(`✅ Created original directory: ${originalDir}`);
      }
      
      // Read original file
      const content = fs.readFileSync(fromPath, 'utf8');
      
      // Write the content to the new file
      fs.writeFileSync(toPath, content);
      console.log(`✅ Created: ${toPath}`);
      
      // Create a disabled version in place of the original
      const disabledContent = `// This file has been renamed to avoid routing conflicts
// The original content is now at ${to}
export const dynamic = 'force-static';
export default function DisabledPage() {
  return null;
}`;
      fs.writeFileSync(fromPath, disabledContent);
      console.log(`✅ Disabled: ${fromPath}`);
    } catch (err) {
      console.error(`❌ Error handling file ${from}:`, err);
    }
  } else {
    console.log(`⏭️ ${from} does not exist, skipping`);
  }
});

console.log('Route conflict fixes completed!'); 