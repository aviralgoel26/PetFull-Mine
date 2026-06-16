#!/bin/bash

# MongoDB Data Import Script for PetFull
# This script imports the users and donations data into MongoDB Atlas

# UPDATE THESE VALUES:
MONGODB_URI="mongodb+srv://petfull_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/petfull-db?retryWrites=true&w=majority"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔄 Starting MongoDB Data Import..."

# Import Users collection
echo "📥 Importing users..."
mongoimport --uri "$MONGODB_URI" --collection users --file "$SCRIPT_DIR/users.json" --jsonArray

if [ $? -eq 0 ]; then
    echo "✅ Users imported successfully!"
else
    echo "❌ Failed to import users"
    exit 1
fi

# Import Donations collection
echo "📥 Importing donations..."
mongoimport --uri "$MONGODB_URI" --collection donations --file "$SCRIPT_DIR/donations.json" --jsonArray

if [ $? -eq 0 ]; then
    echo "✅ Donations imported successfully!"
else
    echo "❌ Failed to import donations"
    exit 1
fi

echo "🎉 All data imported successfully!"
