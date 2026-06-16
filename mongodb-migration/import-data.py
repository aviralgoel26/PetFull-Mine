import json
import sys
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, DuplicateKeyError

# Configuration
MONGODB_URI = "mongodb+srv://aviralgoel9th_db_user:HhBaLA3Td616vwxU@clusterpetfull.fhoggd6.mongodb.net/?appName=ClusterPetfull"
DATABASE_NAME = "petfull-db"

def import_data():
    try:
        # Connect to MongoDB
        print("🔌 Connecting to MongoDB Atlas...")
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        
        # Verify connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB!")
        
        # Get database
        db = client[DATABASE_NAME]
        
        # Import Users
        print("📥 Importing users...")
        with open('users.json', 'r') as f:
            users_data = json.load(f)
        
        users_collection = db['users']
        users_collection.delete_many({})  # Clear existing data
        result_users = users_collection.insert_many(users_data)
        users_count = len(users_data)
        print(f"✅ Imported {users_count} users!")
        
        # Import Donations
        print("📥 Importing donations...")
        with open('donations.json', 'r') as f:
            donations_data = json.load(f)
        
        donations_collection = db['donations']
        donations_collection.delete_many({})  # Clear existing data
        result_donations = donations_collection.insert_many(donations_data)
        donations_count = len(donations_data)
        print(f"✅ Imported {donations_count} donations!")
        
        print("\n🎉 All data imported successfully!")
        print(f"   Database: {DATABASE_NAME}")
        print(f"   Users collection: {users_count} documents")
        print(f"   Donations collection: {donations_count} documents")
        
        client.close()
        return True
        
    except ServerSelectionTimeoutError:
        print("❌ Failed to connect to MongoDB. Check your connection string and internet connection.")
        return False
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    success = import_data()
    sys.exit(0 if success else 1)
