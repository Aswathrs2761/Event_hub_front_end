# 401 Unauthorized Login Error - Troubleshooting Guide

## Quick Fixes to Try (in order):

### 1. **Verify Backend is Running**
```powershell
# Check if backend server is running
curl http://localhost:5000/api/auth/login -X GET
```
- If you get a response: ✅ Backend is running
- If you get `ERR_NAME_NOT_RESOLVED` or connection refused: ❌ Start your backend server

**Start backend:**
```bash
cd c:\Full_stack\Event_hub_backend  # or your backend folder
npm start
# or
node server.js
```

---

### 2. **Check Credentials in Database**
Make sure your test user exists in the database:

```javascript
// Common test credentials to try:
{
  email: "test@example.com",
  password: "password123"
}
// OR
{
  email: "user@gmail.com", 
  password: "12345678"
}
```

---

### 3. **Verify API Endpoint Format**
Check your backend `/auth/login` endpoint expects:

**Request Body (what we send):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "role": "user",
  "message": "Login successful"
}
```

---

### 4. **Common Backend Issues**

#### a) Database Connection Failed
```
Error: Could not connect to MongoDB
Solution: Check MongoDB is running
```

#### b) User Not Found
```
Error: User does not exist
Solution: Register a new account or insert test user in DB
```

#### c) Password Mismatch
```
Error: Invalid credentials
Solution: Verify password matches (case-sensitive!)
```

#### d) CORS Issue (if frontend and backend on different ports)
```javascript
// Your backend should have CORS enabled:
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

### 5. **Browser Console Debug Steps**

1. Open **Chrome DevTools** (F12)
2. Go to **Console** tab
3. Try login and check for:
   - 🔐 `🔐 Attempting login with: { email: "..." }`
   - ✅ `✅ Login successful:` (success) or
   - ❌ `❌ Login error:` (failure with details)

4. Check **Network** tab:
   - Click `POST /auth/login`
   - See **Request** body and **Response** body
   - Check **Status Code** (should be 200, not 401)

---

### 6. **Test with Postman/cURL**

**Test your backend directly:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

If this works, issue is with frontend. If this fails, issue is with backend.

---

### 7. **Frontend Validation Checklist**

✅ Email is valid format (contains @)
✅ Password is not empty
✅ No extra spaces in credentials
✅ API URL is correct: `http://localhost:5000/api`
✅ Network tab shows request being sent

---

### 8. **Check Backend Logs**

Look at your backend terminal for error messages:
```
❌ User not found
❌ Invalid password
❌ Database connection error
❌ JWT secret not configured
```

---

## Quick Diagnostic Command

Run this in your backend folder:
```javascript
// Test script to verify login endpoint
const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Login works:', res.data);
  } catch (err) {
    console.log('❌ Login failed:', {
      status: err.response?.status,
      message: err.response?.data?.message,
      error: err.message
    });
  }
}

testLogin();
```

---

## Common Status Codes:

| Code | Meaning | Solution |
|------|---------|----------|
| 401 | Unauthorized (wrong credentials) | Verify email/password in DB |
| 404 | Not Found (user doesn't exist) | Register new account |
| 500 | Server Error | Check backend logs |
| 0 / ERR_NETWORK | No server response | Start backend server |

---

## Next Steps:

1. **Verify backend is running** at http://localhost:5000
2. **Check browser console** (F12) for detailed error logs
3. **Test endpoint with Postman** to confirm it works
4. **Verify test user exists** in your database
5. **Share the backend error logs** if still not working
