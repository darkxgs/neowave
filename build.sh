#!/bin/bash

echo "Starting build process..."

# Clean lock files
echo "Cleaning lock files..."
node clean-lockfiles.js

# Fix route conflicts
echo "Fixing route conflicts..."
node fix-routes.js

# Build Next.js app
echo "Building Next.js app..."
NODE_OPTIONS='--max-old-space-size=4096' next build

# Fix Next.js build output
echo "Fixing Next.js build output..."
node fix-nextjs-build.js

echo "Build completed!" 