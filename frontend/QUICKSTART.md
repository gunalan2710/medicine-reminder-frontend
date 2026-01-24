# Quick Start Guide - Medicine Reminder System Frontend

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on http://localhost:8080

## Installation

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- React 18
- React Router DOM
- Axios
- Recharts
- React Icons
- Vite

### Step 3: Start Development Server
```bash
npm run dev
```

The application will start on **http://localhost:3000**

## First Time Setup

1. **Register a new account:**
   - Go to http://localhost:3000/register
   - Choose role: Patient or Caregiver
   - Fill in your details
   - Click "Create Account"

2. **Login:**
   - You'll be automatically logged in after registration
   - Or go to http://localhost:3000/login

3. **Add your first medicine:**
   - Click "Add Medicine" button
   - Fill in medicine details
   - Add schedule times
   - Click "Add Medicine"

4. **Track your doses:**
   - View today's doses on the dashboard
   - Mark doses as Taken, Missed, or Snooze
   - Check your adherence rate

## Features Overview

### For Patients
- ✅ Add and manage medicines
- ✅ Track daily doses
- ✅ View adherence statistics
- ✅ Generate reports

### For Caregivers
- ✅ All patient features
- ✅ Add and monitor patients
- ✅ View patient adherence
- ✅ Track multiple patients

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 8080
- Check `.env` file has correct API URL
- Verify CORS is enabled in backend

### npm install fails
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### Port 3000 already in use
- Change port in `vite.config.js`:
  ```js
  server: {
    port: 3001, // Change to any available port
  }
  ```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

To preview production build:
```bash
npm run preview
```

## Theme Toggle
Click the sun/moon icon in the navbar to switch between light and dark modes.

## Support
For issues or questions, refer to the main README.md file.

---

**Happy Medication Tracking! 💊**
