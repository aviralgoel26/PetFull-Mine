import json
from pymongo import MongoClient

MONGODB_URI = "mongodb+srv://aviralgoel9th_db_user:HhBaLA3Td616vwxU@clusterpetfull.fhoggd6.mongodb.net/?appName=ClusterPetfull"

try:
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ Connected to MongoDB!\n")
    
    db = client['petfull-db']
    
    # Check users collection
    print("=" * 60)
    print("USERS COLLECTION")
    print("=" * 60)
    users_collection = db['users']
    users = list(users_collection.find())
    print(f"Total users: {len(users)}\n")
    
    for user in users:
        print(f"ID: {user.get('_id')}")
        print(f"Email: {user.get('email')}")
        print(f"Full Name: {user.get('fullName')}")
        print(f"Role: {user.get('role')}")
        print(f"Password: {user.get('password')}")
        print("-" * 60)
    
    # Check donations collection
    print("\n" + "=" * 60)
    print("DONATIONS COLLECTION")
    print("=" * 60)
    donations_collection = db['donations']
    donations = list(donations_collection.find())
    print(f"Total donations: {len(donations)}\n")
    
    for donation in donations[:3]:  # Show first 3
        print(f"ID: {donation.get('_id')}")
        print(f"Food: {donation.get('foodName')}")
        print(f"Donor ID: {donation.get('donorId')}")
        print(f"Status: {donation.get('status')}")
        print("-" * 60)
    
    # Check database stats
    print("\n" + "=" * 60)
    print("DATABASE STATS")
    print("=" * 60)
    stats = db.command("dbStats")
    print(f"Database: {stats.get('db')}")
    print(f"Collections: {stats.get('collections')}")
    print(f"Data Size: {stats.get('dataSize')} bytes")
    
    client.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
