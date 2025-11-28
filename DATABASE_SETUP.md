# 🌱 Urban Gardening - MySQL Database Setup Guide

## 📋 Prerequisites

Before starting, make sure you have installed:
- ✅ MySQL Workbench (Download from: https://dev.mysql.com/downloads/workbench/)
- ✅ Node.js (Download from: https://nodejs.org/)

---

## 🗄️ STEP 1: Create Database in MySQL Workbench

### 1. Open MySQL Workbench
- Launch MySQL Workbench on your computer

### 2. Connect to MySQL Server
- Click on your local MySQL connection (usually "Local instance MySQL80" or similar)
- Enter your MySQL root password when prompted

### 3. Run the Database Schema
- Click **File** → **Open SQL Script**
- Navigate to: `Urban Gardening/database/schema.sql`
- Click **Open**
- Click the ⚡ **Execute** button (lightning bolt icon) or press `Ctrl+Shift+Enter`

### 4. Verify Database Creation
Run this query to verify:
```sql
USE urban_gardening;
SHOW TABLES;
```

You should see these tables:
- ✅ users
- ✅ showcase_posts
- ✅ user_plants
- ✅ sessions

---

## ⚙️ STEP 2: Configure Backend Server

### 1. Navigate to Backend Folder
Open PowerShell/Terminal and run:
```powershell
cd "C:\Users\akank\OneDrive\Desktop\Urban Gradening\backend"
```

### 2. Install Dependencies
```powershell
npm install
```

This will install:
- express (web server)
- mysql2 (MySQL database connector)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- cors (cross-origin requests)
- dotenv (environment variables)

### 3. Create Environment File
Copy the example file:
```powershell
Copy-Item .env.example .env
```

### 4. Edit .env File
Open `backend\.env` in your code editor and update:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=urban_gardening
DB_PORT=3306

PORT=3000
JWT_SECRET=change_this_to_a_random_secret_key_123456789
FRONTEND_URL=http://127.0.0.1:5500
```

**⚠️ IMPORTANT:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password!

---

## 🚀 STEP 3: Start the Backend Server

### 1. Run the Server
In PowerShell (from backend folder):
```powershell
npm start
```

You should see:
```
✅ MySQL Database Connected Successfully!
🚀 Server running on http://localhost:3000
📊 API Health: http://localhost:3000/api/health
```

### 2. Test the Server
Open your browser and go to:
```
http://localhost:3000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "Urban Gardening API is running!",
  "timestamp": "2025-11-26T..."
}
```

---

## 🌐 STEP 4: Run Your Frontend

### 1. Open Frontend in VS Code
- Right-click on `src/html/login.html`
- Select **"Open with Live Server"**

OR

- Open `src/html/login.html` in your browser directly

### 2. Test Signup
1. Go to signup page
2. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: Test1234
   - Confirm Password: Test1234
   - ✅ Check "I agree to terms"
3. Click **Sign Up**

### 3. Verify in Database
In MySQL Workbench, run:
```sql
SELECT * FROM users;
```

You should see your new user!

### 4. Test Login
1. Go to login page
2. Enter:
   - Email: john@example.com
   - Password: Test1234
3. Click **Sign In**
4. You should be redirected to the home page!

---

## 🔍 Common Issues & Solutions

### ❌ "MySQL Connection Error"
**Problem:** Can't connect to MySQL database

**Solutions:**
- ✅ Make sure MySQL server is running
- ✅ Check your password in `.env` file
- ✅ Verify database name is `urban_gardening`
- ✅ Run `schema.sql` again in MySQL Workbench

### ❌ "CORS Error" in Browser
**Problem:** Frontend can't access backend API

**Solution:**
- ✅ Make sure backend server is running on port 3000
- ✅ Check `FRONTEND_URL` in `.env` matches your frontend URL

### ❌ "npm install" Fails
**Problem:** Can't install Node.js packages

**Solution:**
- ✅ Make sure Node.js is installed: `node --version`
- ✅ Delete `node_modules` folder and try again
- ✅ Run PowerShell as Administrator

### ❌ "Port 3000 already in use"
**Problem:** Another app is using port 3000

**Solution:**
- Change `PORT=3000` to `PORT=3001` in `.env`
- Update frontend files to use `http://localhost:3001`

---

## 📊 API Endpoints Reference

Your backend provides these endpoints:

### Authentication
- **POST** `/api/auth/signup` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/user/profile` - Get user profile (requires token)

### Showcase
- **GET** `/api/showcase` - Get all posts
- **POST** `/api/showcase` - Create new post (requires token)

### Health Check
- **GET** `/api/health` - Check if API is running

---

## 🎯 Next Steps

Your app now has:
- ✅ Real MySQL database
- ✅ User authentication (signup/login)
- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ Secure API endpoints

To keep developing:
1. Keep the backend server running in PowerShell
2. Use Live Server for frontend development
3. Check MySQL Workbench to see your data

---

## 🛑 Stopping the Server

To stop the backend server:
- Press `Ctrl+C` in PowerShell window
- Type `Y` and press Enter

---

## 💡 Development Tips

### Auto-Restart on Changes
Install nodemon for development:
```powershell
npm install -D nodemon
```

Then run:
```powershell
npm run dev
```

Server will auto-restart when you edit code!

### View Logs
Check PowerShell terminal for:
- API requests
- Database queries
- Errors and warnings

### Database Management
Use MySQL Workbench to:
- View all users: `SELECT * FROM users;`
- Delete user: `DELETE FROM users WHERE email = 'test@example.com';`
- View posts: `SELECT * FROM showcase_posts;`

---

## 📞 Need Help?

If something doesn't work:
1. Check PowerShell terminal for error messages
2. Check browser console (F12) for frontend errors
3. Verify MySQL is running
4. Make sure `.env` file has correct credentials

Happy Gardening! 🌱
