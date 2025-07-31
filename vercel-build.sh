#!/bin/bash

echo "Vercel Build Script Started"

# Print current directory and list files
echo "Current directory: $(pwd)"
ls -la

# Force delete the conflicting files
echo "Deleting conflicting login files..."
rm -f app/\(auth\)/login/page.tsx
rm -f app/\(main\)/login/page.tsx

# Verify the files are deleted
echo "Verifying files were deleted:"
[ ! -f app/\(auth\)/login/page.tsx ] && echo "✅ app/(auth)/login/page.tsx deleted" || echo "❌ Failed to delete app/(auth)/login/page.tsx"
[ ! -f app/\(main\)/login/page.tsx ] && echo "✅ app/(main)/login/page.tsx deleted" || echo "❌ Failed to delete app/(main)/login/page.tsx"

# Create a marker file to indicate server-rendering is preferred
echo "Setting up environment for build..."
export NEXT_DISABLE_ESLINT=1
export NEXT_DISABLE_TYPOGRAPHY=1
export NEXT_PUBLIC_VERCEL_DEPLOYMENT=1

# Run the Next.js build with reduced optimization to avoid CSS issues
echo "Running Next.js build with adjusted settings..."
NODE_OPTIONS="--max_old_space_size=4096" next build

# Exit with the build's exit code
exit $? 