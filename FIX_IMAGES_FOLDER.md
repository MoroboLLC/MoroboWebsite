# Quick Fix: Create Images Folder and Add App Icons

## Problem
The `images` item in your workspace is an **empty file**, not a folder. This causes errors when trying to load app icons.

## Solution

### Step 1: Remove the Empty File and Create Folder
```powershell
# Navigate to your website directory
cd "c:\Users\robo1\OneDrive\Documents\MoroboWebsite"

# Remove the empty 'images' file
Remove-Item .\images -Force

# Create a proper images directory
New-Item -Path .\images -ItemType Directory

# Verify it was created
Get-Item .\images
```

### Step 2: Add Your App Icons

You'll need to add these image files to the `images` folder:

1. **indecision_app.png** - Icon/screenshot for Indecision app
2. **motonia_app.png** - Icon/screenshot for Motonia app  
3. **morganmiller_site.png** - Screenshot/preview of Morgan Miller website (optional)

### Where to Get the Icons

**For Indecision:**
- Export from your app's assets
- Use App Store screenshot
- Recommended size: 512x512px or 1024x1024px

**For Motonia:**
- Export from your app's assets
- Use App Store screenshot
- Recommended size: 512x512px or 1024x1024px

**For Morgan Miller Site:**
- Take a screenshot of the homepage
- Crop to a nice preview
- Recommended size: 1200x800px (landscape)

### Step 3: Add Images to Folder

```powershell
# Example: Copy images if you have them elsewhere
Copy-Item "C:\path\to\indecision_icon.png" .\images\indecision_app.png
Copy-Item "C:\path\to\motonia_icon.png" .\images\motonia_app.png
Copy-Item "C:\path\to\morganmiller_screenshot.png" .\images\morganmiller_site.png
```

### Step 4: Verify Setup

```powershell
# List images folder contents
Get-ChildItem .\images

# Should show:
# - indecision_app.png
# - motonia_app.png
# - morganmiller_site.png
```

## Current Image References

The website expects these images:

| Page | Image Path | Fallback |
|------|-----------|----------|
| Main page | `images/indecision_app.png` | `placeholder_app.png` |
| Main page | `images/motonia_app.png` | `placeholder_app.png` |
| Main page | `images/morganmiller_site.png` | `placeholder_app.png` |
| Apps page | `images/indecision_app.png` | `placeholder_app.png` |
| Apps page | `images/motonia_app.png` | `placeholder_app.png` |

## Temporary Solution

If you don't have the icons yet:
- **No action needed!** The placeholder image will show instead
- Website will function normally
- You can add real icons later

## After Adding Images

1. Refresh your website in browser
2. Hard reload (Ctrl + F5) to clear cache
3. Icons should now appear instead of placeholder

---

**Note**: The onerror handler in your HTML automatically falls back to `placeholder_app.png` if any image is missing, so your site won't break even without the images folder.
