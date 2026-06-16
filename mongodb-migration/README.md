# PetFull MongoDB Migration - Complete Guide

## 📋 Phase 1: MongoDB Atlas Setup & Data Import

### Step 1: Create MongoDB Atlas Account & Cluster

1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Click **Sign Up** (free account)
3. Create account with email/password
4. Verify email
5. Click **Create** → Create a **Deployment**

### Step 2: Select Free Tier
- Click **Build a Database**
- Select **M0 Sandbox** (Free tier - 512MB storage)
- Choose region: `AWS - us-east-1` (or your preferred region)
- Click **Create Deployment** (takes 1-2 minutes)

### Step 3: Create Database User
1. Go to **Security** → **Database Access** (in left sidebar)
2. Click **+ Add New Database User**
3. Enter:
   - **Username:** `petfull_user`
   - **Password:** (Generate auto or create strong password)
   - **Built-in Role:** Select `Atlas admin`
4. Click **Add User**
5. **COPY THE PASSWORD** (you'll need it next)

### Step 4: Set Network Access
1. Go to **Security** → **Network Access**
2. Click **+ Add IP Address**
3. Select **ALLOW ACCESS FROM ANYWHERE** (or add your IP)
4. Click **Confirm**

### Step 5: Get Connection String
1. Go to **Clusters** (dashboard)
2. Click **Connect** button on your cluster
3. Select **Drivers** option
4. Copy the connection string (looks like):
```
mongodb+srv://petfull_user:PASSWORD@cluster0.xxxxx.mongodb.net/petfull-db?retryWrites=true&w=majority
```
5. **Replace `PASSWORD`** with the actual password you created in Step 3
6. **SAVE THIS STRING** - we need it for import

---

## 📥 Step 6: Import Your Data

### Option A: Windows (PowerShell)

1. **Install MongoDB Tools** (if not already installed):
   - Download from: https://www.mongodb.com/try/download/database-tools
   - Extract and add to PATH, or use full path

2. **Edit the import script**:
   - Open: `mongodb-migration/import-data.ps1`
   - Find this line:
     ```powershell
     $MONGODB_URI = "mongodb+srv://petfull_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/petfull-db?retryWrites=true&w=majority"
     ```
   - **Replace** with your actual connection string from Step 5
   - Save the file

3. **Run the import**:
   ```powershell
   cd c:\Users\Asus\OneDrive\Desktop\PETFULL\mongodb-migration
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   .\import-data.ps1
   ```

4. **Wait for completion** - you should see:
   ```
   ✅ Users imported successfully!
   ✅ Donations imported successfully!
   🎉 All data imported successfully!
   ```

### Option B: Mac/Linux

1. **Install MongoDB Tools**:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-database-tools
   ```

2. **Edit the import script**:
   - Open: `mongodb-migration/import-data.sh`
   - Replace connection string (same as above)
   - Save

3. **Run the import**:
   ```bash
   cd ~/Desktop/PETFULL/mongodb-migration
   chmod +x import-data.sh
   ./import-data.sh
   ```

---

## ✅ Verify Import Success

1. Go to MongoDB Atlas dashboard
2. Click **Browse Collections**
3. Verify you see:
   - Database: `petfull-db`
   - Collections: `users` (3 docs), `donations` (6 docs)

---

## 🎯 Next: Phase 2 - Backend Code Changes

Once data is imported successfully, we'll:
1. Update `pom.xml` (replace JPA with MongoDB)
2. Update `application.properties` (add MongoDB connection)
3. Update Entity classes (`@Entity` → `@Document`)
4. Update Repositories (`JpaRepository` → `MongoRepository`)
5. Test & Deploy

---

## 💡 Need Help?

If `mongoimport` command not found:
- Use full path: `"C:\Program Files\MongoDB\Tools\100\bin\mongoimport.exe"`
- Or use MongoDB Atlas UI to import JSON files directly

If connection fails:
- Check IP whitelist in Network Access
- Verify password is correct in connection string
- Check internet connection
