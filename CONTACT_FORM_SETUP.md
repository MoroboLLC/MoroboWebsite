# Contact Form Setup Instructions

## Email Updated
All email addresses have been changed from `morobo.llc@gmail.com` to `contact@morobo.org`

## Contact Form Configuration

The contact form in `index.html` has been set up to use **Formspree**, a free form backend service.

### To Complete Setup:

1. **Go to [Formspree.io](https://formspree.io)**
2. **Sign up** for a free account using `contact@morobo.org`
3. **Create a new form** and get your form endpoint
4. **Replace** the placeholder in `index.html`:
   - Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
   - Replace `YOUR_FORM_ID` with your actual Formspree form ID

### Formspree Features (Free Tier):
- ✅ 50 submissions per month
- ✅ Email notifications to contact@morobo.org
- ✅ Spam filtering
- ✅ File uploads (if needed)
- ✅ Custom redirect after submission

### Alternative: Use Netlify Forms
If you deploy to Netlify, you can use their built-in form handling:
1. Add `netlify` attribute to the form
2. Add a hidden input: `<input type="hidden" name="form-name" value="contact" />`
3. Netlify will automatically handle submissions

### Alternative: Custom PHP Backend
If you have PHP hosting, create `contact-handler.php`:
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);
    
    $to = "contact@morobo.org";
    $subject = "New Contact Form Submission from $name";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        header("Location: /thank-you.html");
    } else {
        header("Location: /error.html");
    }
}
?>
```

## Email Addresses Updated in Files:
- ✅ `index.html` - contact@morobo.org
- ✅ `apps/indecision/support/index.html` - contact@morobo.org
- ✅ `apps/motonia/support/index.html` - contact@morobo.org
- ✅ `apps/indecision/EULA/index.html` - contact@morobo.org
- ✅ `apps/indecision/privacypolicy/index.html` - contact@morobo.org
- ✅ `apps/motonia/privacypolicy/index.html` - contact@morobo.org

## Next Steps:
1. Set up Formspree account with contact@morobo.org
2. Get your form endpoint ID
3. Update index.html with the actual form ID
4. Test the contact form
5. Configure email forwarding if needed
