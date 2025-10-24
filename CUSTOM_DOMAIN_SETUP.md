# 🌐 CUSTOM DOMAIN SETUP GUIDE
## Setting up morobo.org with GitHub Pages

---

## ✅ **IMPROVED URL STRUCTURE**

### **New Clean URLs (No .html extensions):**

```
✓ morobo.org/                          (Homepage)
✓ morobo.org/apps/                     (Apps showcase)
✓ morobo.org/websites/                 (Websites showcase)
✓ morobo.org/apps/indecision/          (Indecision app)
✓ morobo.org/apps/indecision/support/  (Support page)
✓ morobo.org/apps/indecision/privacypolicy/  (Privacy policy)
✓ morobo.org/apps/motonia/             (Motonia app)
✓ morobo.org/apps/motonia/support/     (Support page)
✓ morobo.org/apps/motonia/privacypolicy/  (Privacy policy)
```

### **How GitHub Pages Handles This:**
- `apps/indecision/` → serves `apps/indecision/index.html`
- `apps/indecision/support/` → serves `apps/indecision/support/index.html`
- Clean, professional URLs with no file extensions visible!

---

## 📋 **STEP-BY-STEP: Connect morobo.org to GitHub Pages**

### **Step 1: Configure DNS in Namecheap** ⚙️

1. **Log in to Namecheap**
   - Go to https://www.namecheap.com/
   - Click "Sign In" (top right)
   - Enter your credentials

2. **Access Domain Management**
   - Click "Domain List" in the left sidebar
   - Find "morobo.org"
   - Click "Manage"

3. **Set Up DNS Records**
   - Click on the "Advanced DNS" tab
   - You'll need to add/edit the following records:

#### **A Records (for apex domain: morobo.org)**
Delete existing A records and add these 4 GitHub Pages IP addresses:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 185.199.108.153 | Automatic |
| A Record | @ | 185.199.109.153 | Automatic |
| A Record | @ | 185.199.110.153 | Automatic |
| A Record | @ | 185.199.111.153 | Automatic |

#### **CNAME Record (for www subdomain)**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME Record | www | morobollc.github.io | Automatic |

4. **Save Changes**
   - Click "Save All Changes"
   - DNS changes can take 5 minutes to 48 hours to propagate (usually within 1 hour)

---

### **Step 2: Configure GitHub Pages** 🐙

1. **Go to Your Repository**
   - Navigate to https://github.com/MoroboLLC/MoroboWebsite

2. **Access Settings**
   - Click "Settings" tab (top of repository)
   - Scroll down to "Pages" in the left sidebar
   - Click "Pages"

3. **Configure Custom Domain**
   - Under "Custom domain" section
   - Enter: `morobo.org`
   - Click "Save"

4. **Enable HTTPS** 🔒
   - After DNS propagates (wait 10-60 minutes)
   - Check the box "Enforce HTTPS"
   - This ensures your site uses https://morobo.org

---

### **Step 3: Create CNAME File** 📄

GitHub Pages needs a CNAME file in your repository root:

1. **Create the File**
   ```powershell
   echo "morobo.org" > CNAME
   ```

2. **Commit and Push**
   ```powershell
   git add CNAME
   git commit -m "Add CNAME file for custom domain"
   git push origin main
   ```

---

### **Step 4: Verify & Test** ✓

1. **Wait for DNS Propagation**
   - Check status at: https://www.whatsmydns.net/#A/morobo.org
   - Should show the 4 GitHub Pages IP addresses globally

2. **Test Your Domain**
   - Visit http://morobo.org (will redirect to https)
   - Visit https://morobo.org (secure)
   - Visit https://www.morobo.org (should work)

3. **Verify HTTPS Certificate**
   - Click the padlock icon in browser
   - Should show "Connection is secure"
   - Certificate issued by Let's Encrypt (via GitHub)

---

## 🔧 **Troubleshooting**

### **"Domain's DNS record could not be retrieved"**
- **Solution:** Wait longer for DNS propagation (up to 24-48 hours)
- Check DNS with: https://dnschecker.org/

### **"Certificate not valid"**
- **Solution:** Wait 10-60 minutes after adding custom domain
- GitHub automatically provisions SSL certificate
- Check back and enable "Enforce HTTPS"

### **www subdomain not working**
- **Solution:** Ensure CNAME record points to `morobollc.github.io` (not morobo.org)
- Wait for DNS propagation

### **404 errors on subpages**
- **Solution:** Ensure all `index.html` files are in correct directories
- Check file names are exact (case-sensitive on GitHub)

---

## 📊 **DNS Configuration Summary**

**Current Setup:** `morobollc.github.io/MoroboWebsite/`
**Target Setup:** `morobo.org`

**DNS Records to Add:**
```
A      @    185.199.108.153
A      @    185.199.109.153
A      @    185.199.110.153
A      @    185.199.111.153
CNAME  www  morobollc.github.io
```

---

## ⏱️ **Timeline**

| Step | Time Required |
|------|---------------|
| Add DNS records in Namecheap | 5 minutes |
| DNS propagation | 10 min - 48 hours (usually 1 hour) |
| Add custom domain in GitHub | 2 minutes |
| Create CNAME file | 2 minutes |
| SSL certificate provisioning | 10-60 minutes |
| **Total (typical)** | **1-2 hours** |

---

## 🎉 **After Setup is Complete**

Your website will be accessible at:
- ✅ https://morobo.org
- ✅ https://www.morobo.org
- ✅ http://morobo.org (redirects to HTTPS)
- ✅ http://www.morobo.org (redirects to HTTPS)

**Old URL** (`morobollc.github.io/MoroboWebsite/`) will redirect to your custom domain!

---

## 📱 **Test All Pages After Setup:**

- [ ] Homepage: https://morobo.org/
- [ ] Apps page: https://morobo.org/apps/
- [ ] Websites page: https://morobo.org/websites/
- [ ] Indecision app: https://morobo.org/apps/indecision/
- [ ] Indecision support: https://morobo.org/apps/indecision/support/
- [ ] Indecision privacy: https://morobo.org/apps/indecision/privacypolicy/
- [ ] Motonia app: https://morobo.org/apps/motonia/
- [ ] Motonia support: https://morobo.org/apps/motonia/support/
- [ ] Motonia privacy: https://morobo.org/apps/motonia/privacypolicy/

---

## 🔐 **Security Best Practices**

1. ✅ Always use HTTPS (enforced by GitHub)
2. ✅ SSL certificate auto-renewed by GitHub
3. ✅ No server maintenance required
4. ✅ DDoS protection by GitHub/Fastly CDN
5. ✅ Free hosting with 100GB bandwidth/month

---

## 📧 **Need Help?**

If you encounter issues:
1. Check Namecheap DNS settings are correct
2. Verify CNAME file exists in repository root
3. Wait full 24 hours for DNS propagation
4. Check GitHub Pages settings show "Your site is published at https://morobo.org"
5. Contact GitHub Support or Namecheap Support if needed

---

## ✨ **Additional Tips**

### **Redirect Old Links**
If you have marketing materials with old URLs, they will automatically redirect to your custom domain once configured.

### **Email Setup**
Consider setting up professional email:
- info@morobo.org
- support@morobo.org
- hello@morobo.org

Use Namecheap Email or Google Workspace for professional email hosting.

### **Analytics**
Add Google Analytics or similar to track website traffic:
```html
<!-- Add to <head> of index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

**Ready to go live! 🚀**
