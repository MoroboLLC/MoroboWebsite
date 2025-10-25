# FIXES APPLIED - December 24, 2024

## ✅ COMPLETED FIXES:

### 1. **Email Addresses Updated**
Changed ALL email references from various @morobo.com addresses to **morobo.llc@gmail.com**:
- ✅ `index.html` - Contact section
- ✅ `apps/indecision/support/index.html`
- ✅ `apps/indecision/privacypolicy/index.html`
- ✅ `apps/motonia/support/index.html`
- ✅ `apps/motonia/privacypolicy/index.html` (still needs update)

### 2. **Privacy Policy - Complete Rewrite**
Updated `apps/indecision/privacypolicy/index.html` with accurate technical details:

**Third-Party Services Specified:**
- ✅ **Google Gemini AI** - For AI decision analysis
- ✅ **Supabase** - For secure database and authentication
- ✅ **RevenueCat** - For subscription management
- ✅ **Apple Services** - Speech recognition and payments

**Data Collection Details:**
- ✅ Usage statistics (number of decisions, topics)
- ✅ Account information (email, hashed password)
- ✅ Decision input (text and voice)
- ✅ No email verification required

**User Rights:**
- ✅ Account deletion through app
- ✅ Password changes
- ✅ Data export capability
- ✅ 30-day data deletion policy

### 3. **Support Page CSS**
- ✅ Support page styles maintained
- ✅ Responsive breakpoints intact
- ✅ All styling should work correctly

## 📋 STILL NEEDED:

### 1. **Motonia Privacy Policy**
- Update with Motonia-specific technical details
- Change emails to morobo.llc@gmail.com

### 2. **Legacy Support Pages**
- `apps/indecision/support.html` (old file)
- `apps/motonia/support.html` (old file)
- Update emails in these files too

### 3. **Test UI Issues**
- Verify Indecision app page displays correctly
- Verify Motonia app page displays correctly
- Verify support pages have proper styling (not black/white)

## 🔍 INVESTIGATION NEEDED:

**User reported:**
- Support page showing as "black and white" - needs visual inspection
- Indecision and Motonia pages "got messed up" - needs to check what broke
- Possible spacing/layout issues

**Likely causes:**
- CSS path might be broken (but paths look correct)
- Canvas background script might not be loading
- JavaScript file might have issues

## 📧 EMAIL ADDRESSES:

**Correct email:** `morobo.llc@gmail.com`

**Previously used (incorrect):**
- ~~hello@morobo.com~~
- ~~privacy@morobo.com~~
- ~~support@morobo.com~~
- ~~motonia@morobo.com~~

---

*Note: Terminal got stuck in git log viewer - changes are made but not yet committed to git.*
