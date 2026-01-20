# Project Tracking System

## Overview

A simple project tracking system that allows clients to view their project progress and allows you (admin) to update progress without complex user authentication.

## How It Works

### For Clients (Public)
1. Clients visit `/track.html`
2. They enter their **Project ID** (e.g., `PROJ-12345`)
3. They see:
   - Project name and type
   - Progress percentage with visual progress bar
   - Current status message
   - Last updated timestamp

### For You (Admin)
1. Visit `/admin.html`
2. Enter the admin password (default: `morobo2024` - **CHANGE THIS!**)
3. You can:
   - Add new projects
   - Update progress percentage (0-100%)
   - Update status messages
   - Delete projects
   - View projects as clients would see them

## Setup Instructions

### 1. Change Admin Password

**IMPORTANT:** Change the admin password before going live!

Edit `admin.js` and change this line:
```javascript
const ADMIN_PASSWORD = 'morobo2024'; // Change this!
```

### 2. Add Your First Project

1. Go to `/admin.html`
2. Enter the admin password
3. Fill in:
   - **Project ID**: A unique identifier (e.g., `PROJ-12345`)
   - **Project Name**: Client's project name
   - **Type**: Mobile App or Website
4. Click "Add Project"
5. Share the Project ID with your client

### 3. Update Progress

1. Log into `/admin.html`
2. Find the project in the list
3. Adjust the progress slider (0-100%)
4. Update the status message (optional)
5. Click "Save Changes"

### 4. Share with Clients

Give clients:
- The tracking page URL: `https://morobo.org/track.html`
- Their Project ID: `PROJ-12345`

Or share a direct link: `https://morobo.org/track.html?id=PROJ-12345`

## Current Storage Method

**Currently using localStorage** - This means:
- ✅ Works immediately, no backend setup needed
- ✅ Simple and fast
- ❌ Data is stored in browser (not persistent across devices)
- ❌ Not suitable for production with multiple admins

## Production Upgrade Path

For production, you'll want to:

1. **Use a Backend API** (recommended):
   - Set up a simple backend (Node.js, Python, etc.)
   - Store projects in a database
   - Add proper authentication
   - Update `track.js` and `admin.js` to fetch from API

2. **Use a Service**:
   - Supabase (free tier available)
   - Firebase
   - Airtable API
   - Google Sheets API

3. **Update the code**:
   - Replace `localStorage` calls with API calls
   - Add error handling
   - Add loading states

## Example Backend Integration

In `track.js`, replace:
```javascript
async function fetchProject(projectId) {
  // Replace localStorage with API call
  const response = await fetch(`https://your-api.com/projects/${projectId}`);
  if (response.ok) {
    return await response.json();
  }
  return null;
}
```

In `admin.js`, replace `saveProjects()` with:
```javascript
async function saveProjects(projects) {
  await fetch('https://your-api.com/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projects)
  });
}
```

## Security Notes

- ⚠️ **Change the admin password** before going live
- ⚠️ The password is currently client-side (not secure for production)
- ⚠️ For production, use server-side authentication
- ⚠️ Consider rate limiting on the admin page
- ⚠️ Use HTTPS (GitHub Pages provides this automatically)

## Features

- ✅ No user accounts needed
- ✅ Simple project ID lookup
- ✅ Visual progress bar
- ✅ Custom status messages
- ✅ Easy to update
- ✅ Mobile responsive
- ✅ Professional appearance

## Troubleshooting

**Client can't find project:**
- Check the Project ID is correct (case-insensitive)
- Verify project exists in admin panel
- Check browser console for errors

**Admin password not working:**
- Check `admin.js` for the correct password
- Clear browser cache and try again
- Check browser console for errors

**Progress not saving:**
- Check browser console for errors
- Verify localStorage is enabled in browser
- Try a different browser

---

**Note:** This system is designed to be simple and functional. For high-security needs or multiple admin users, consider implementing a proper backend with authentication.
