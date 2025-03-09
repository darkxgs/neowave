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

# Run the Next.js build
echo "Running Next.js build..."
next build

# Exit with the build's exit code
exit $? 