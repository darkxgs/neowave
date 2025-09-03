#!/bin/bash

echo "Starting build process..."

# Clean lock files
echo "Cleaning lock files..."
node clean-lockfiles.js

# Fix route conflicts
echo "Fixing route conflicts..."
node fix-routes.js

# Build Next.js app with more memory
echo "Building Next.js app..."
NODE_OPTIONS='--max-old-space-size=4096' next build

# Only run fix-nextjs-build.js if the build succeeded
if [ $? -eq 0 ]; then
  echo "Fixing Next.js build output..."
  node fix-nextjs-build.js
  
  # Manual copy of critical files
  echo "Manual copying of critical files..."
  
  if [ -f ".next/routes-manifest.json" ]; then
    mkdir -p .next/standalone
    cp .next/routes-manifest.json .next/standalone/
    echo "✅ Manually copied routes-manifest.json"
  else
    echo "❌ routes-manifest.json not found"
  fi
  
  echo "Build completed successfully!"
else
  echo "❌ Build failed. Not running build fix."
  exit 1
fi 