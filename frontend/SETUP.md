# Setup Instructions for Medicine Reminder Frontend

## ⚠️ Node.js Installation Required

To run this React application, you need to install Node.js first.

## Step 1: Install Node.js

### Option A: Download from Official Website (Recommended)
1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support) - currently v20.x
3. Run the installer
4. Follow the installation wizard (keep default settings)
5. Restart your computer after installation

### Option B: Using Chocolatey (if you have it)
```powershell
choco install nodejs-lts
```

### Verify Installation
After installing, open a **new** PowerShell/Command Prompt and run:
```bash
node --version
npm --version
```

You should see version numbers like:
```
v20.11.0
10.2.4
```

---

## Step 2: Install Project Dependencies

Once Node.js is installed, open a terminal in VS Code:

1. **Open Terminal in VS Code:**
   - Press `` Ctrl + ` `` (backtick) or
   - Menu: Terminal → New Terminal

2. **Navigate to frontend directory:**
   ```bash
   cd d:\medicine-project\medicine-reminder-system-structure-only.zip_expanded\frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install all required packages (React, Vite, Axios, etc.)
   It may take 2-3 minutes.

---

## Step 3: Start the Development Server

After installation completes:

```bash
npm run dev
```

You should see output like:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

## Step 4: Open in Browser

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the Medicine Reminder login page!

---

## Step 5: Start the Backend (Required)

The frontend needs the backend API to work. In a **separate terminal**:

```bash
cd d:\medicine-project\medicine-reminder-system-structure-only.zip_expanded
mvn spring-boot:run
```

Or if you have the backend already running, make sure it's on port 8080.

---

## Troubleshooting

### Issue: "npm is not recognized"
**Solution:** Node.js is not installed or not in PATH. Restart your computer after installing Node.js.

### Issue: Port 3000 already in use
**Solution:** Stop the process using port 3000 or change the port in `vite.config.js`:
```js
server: {
  port: 3001, // Change to any available port
}
```

### Issue: "Cannot connect to backend"
**Solution:** 
- Make sure backend is running on http://localhost:8080
- Check `.env` file has correct API URL
- Verify backend CORS settings allow http://localhost:3000

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Try again
npm install
```

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Stop the server
Ctrl + C
```

---

## VS Code Extensions (Optional but Recommended)

Install these VS Code extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
2. **Prettier - Code formatter**
3. **ESLint**
4. **Auto Rename Tag**
5. **Path Intellisense**

---

## What to Do After Setup

1. **Register a new account** (Patient or Caregiver)
2. **Login** with your credentials
3. **Add medicines** with schedules
4. **Track doses** on the dashboard
5. **View reports** and analytics
6. **Toggle dark mode** using the moon/sun icon

---

## Need Help?

If you encounter any issues:
1. Check that Node.js is properly installed
2. Ensure backend is running on port 8080
3. Check browser console for errors (F12)
4. Verify all dependencies installed successfully

---

**Once Node.js is installed, the setup is very simple - just `npm install` and `npm run dev`!** 🚀
