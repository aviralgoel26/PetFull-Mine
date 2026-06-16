# MongoDB Data Import Script for PetFull
# This script imports the users and donations data into MongoDB Atlas

# UPDATE THESE VALUES:
$MONGODB_URI = "mongodb+srv://aviralgoel9th_db_user:HhBaLA3Td616vwxU@clusterpetfull.fhoggd6.mongodb.net/?appName=ClusterPetfull"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "🔄 Starting MongoDB Data Import..." -ForegroundColor Green

# Import Users collection
Write-Host "📥 Importing users..." -ForegroundColor Yellow
& mongoimport --uri "$MONGODB_URI" --collection users --file "$SCRIPT_DIR\users.json" --jsonArray

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Users imported successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to import users" -ForegroundColor Red
    exit 1
}

# Import Donations collection
Write-Host "📥 Importing donations..." -ForegroundColor Yellow
& mongoimport --uri "$MONGODB_URI" --collection donations --file "$SCRIPT_DIR\donations.json" --jsonArray

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Donations imported successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to import donations" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 All data imported successfully!" -ForegroundColor Green
