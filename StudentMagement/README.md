# BULINGA Student Management System
React (Vite) + Node.js/Express + MySQL

## 1. Database
Start MySQL, then from `backend/`:
```
npm install
npm run init-db      # creates StudentManagementDB with Students and Users tables
```
(Or run `backend/database/schema.sql` in MySQL Workbench / phpMyAdmin.)
Edit `backend/.env` if your MySQL user/password differ, and set a real `JWT_SECRET`.

## 2. Backend  (http://localhost:5000)
```
cd backend
npm run dev
```
Check http://localhost:5000/test-db — it should say the database is connected.

## 3. Frontend  (http://localhost:5173)
```
cd frontend
npm install
npm run dev
```
Optional: set `VITE_API_URL` if the API is not on `http://localhost:5000/api`.

## 4. Postman
Import `backend/StudentManagement.postman_collection.json`, run the requests in order (1 -> 10).
"Login" stores the JWT automatically in the `token` variable.

## API
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | public (first user = admin, others = teacher) |
| POST | /api/auth/login | public, returns JWT |
| GET | /api/auth/me | logged in |
| GET | /api/students?search= | logged in |
| GET | /api/students/:id | logged in |
| POST | /api/students | logged in |
| PUT | /api/students/:id | logged in |
| DELETE | /api/students/:id | admin only |
