#!/bin/bash

# Set the base directory to the project root
BASE_DIR="$(dirname "$(dirname "$0")")"

echo "Setting up uploads directories..."

# Create upload directories
mkdir -p "$BASE_DIR/uploads/products"
mkdir -p "$BASE_DIR/uploads/logos"

# Set permissions
chmod 755 "$BASE_DIR/uploads"
chmod 755 "$BASE_DIR/uploads/products"
chmod 755 "$BASE_DIR/uploads/logos"

# Create .gitkeep files
touch "$BASE_DIR/uploads/products/.gitkeep"
touch "$BASE_DIR/uploads/logos/.gitkeep"

# Update .gitignore
if ! grep -q "uploads/products/\*" "$BASE_DIR/.gitignore" 2>/dev/null; then
    echo "uploads/products/*" >> "$BASE_DIR/.gitignore"
    echo "!uploads/products/.gitkeep" >> "$BASE_DIR/.gitignore"
    echo "uploads/logos/*" >> "$BASE_DIR/.gitignore"
    echo "!uploads/logos/.gitkeep" >> "$BASE_DIR/.gitignore"
fi

echo "Setup complete!"
