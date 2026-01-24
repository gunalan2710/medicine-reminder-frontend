# Troubleshooting: Add Medicine Button Not Working

## Issue
The "Add Medicine" button is not navigating to the add medicine page when clicked.

## Possible Causes

### 1. Check Browser Console
Open browser developer tools (F12) and check the Console tab for any errors.

### 2. Link Component Issue
The Button is wrapped in a Link component. This should work, but let's verify the navigation.

## Quick Fix

### Option 1: Test if routing works
Try typing the URL directly in the browser:
```
http://localhost:3000/add-medicine
```

If this works, the routing is fine and it's a button/link issue.

### Option 2: Check if you're logged in
The `/add-medicine` route is protected. Make sure you:
1. Are logged in
2. Have a valid JWT token

### Option 3: Hard refresh
Press `Ctrl + Shift + R` to clear cache and reload

## Temporary Workaround

If the button still doesn't work, you can navigate directly by typing in the URL bar:
```
http://localhost:3000/add-medicine
```

## Let me know:
1. Do you see any errors in the browser console (F12)?
2. Are you logged in?
3. Does typing the URL directly work?
