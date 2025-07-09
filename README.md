# 📦 Full-Stack Task Manager – Setup Guide

This project is a full-stack Task Manager application built with:

- ⚙️ **Backend**: Node.js, Express, Sequelize ORM, PostgreSQL  
- 💻 **Frontend**: React, Vite, MUI, React Hook Form, RTK Query

---

## 🚀 Backend Setup (`/backend`)

### 1. Install Dependencies

```bash
cd backend
npm install

### 2. Create .env.development File

DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=task_db
DB_HOST=localhost
DB_DIALECT=postgres
JWT_SECRET=your_jwt_secret

### 3. Perform migrations and start

```bash
npm run migrate
npm run start



---

## 🚀 Backend Setup (`/backend`)

### 1. Install Dependencies

```bash
cd frontend
npm install

### 2. Create .env File

VITE_BE_BASE_URL="http://localhost:5000"

### 3. Start the frontend

```bash
npm run dev

