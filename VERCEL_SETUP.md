# Vercel Deployment Setup Guide

## 🚀 Quick Deployment Steps

### 1. Deploy to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up with GitHub
3. Click "New Project" → Import your repository
4. Vercel will auto-detect React and deploy it

### 2. Connect Your GoDaddy Domain
1. In Vercel dashboard: **Settings** → **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Vercel will show DNS records to add
4. In GoDaddy DNS settings, add the provided records:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: cname.vercel-dns.com
   - **Type**: A
   - **Name**: @
   - **Value**: 76.76.19.61

### 3. Form Backend Setup ✅

Your contact form is now ready to work! Here's what's set up:

#### ✅ **What Works Immediately:**
- Form submissions are logged to Vercel function logs
- Form validation and error handling
- "Thank you" message after submission
- Loading states and proper UX

#### 📧 **Optional: Email Notifications**

To receive emails when someone submits the form:

1. **In Vercel Dashboard:**
   - Go to your project → **Settings** → **Environment Variables**
   - Add these variables:
     ```
     EMAIL_USER = your-email@gmail.com
     EMAIL_PASS = your-app-password
     BUSINESS_EMAIL = viangloballlp@vianglobal.co
     ```

2. **For Gmail Setup:**
   - Go to Google Account → Security → 2-Step Verification
   - Generate an "App Password" (not your regular password)
   - Use this app password as EMAIL_PASS

3. **Redeploy:**
   - After adding environment variables, trigger a new deployment

## 🔍 **Viewing Form Submissions**

### Method 1: Vercel Function Logs
1. Go to Vercel dashboard → Your project
2. Click **Functions** tab
3. Click on `/api/contact`
4. View logs to see all form submissions

### Method 2: Email Notifications (if configured)
- You'll receive an email for each form submission
- Emails include all form data and timestamp

## 🛠 **API Endpoint Details**

Your form submits to: `/api/contact`

**What it does:**
- ✅ Validates all form fields
- ✅ Checks email format
- ✅ Logs submission with timestamp and user info
- ✅ Sends email notification (if configured)
- ✅ Returns proper success/error responses

**Response format:**
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you soon.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 **Troubleshooting**

### Form not submitting?
1. Check browser console for errors
2. Verify the API endpoint is working: `yoursite.com/api/contact`
3. Check Vercel function logs

### Not receiving emails?
1. Verify environment variables are set in Vercel
2. Check spam folder
3. Ensure Gmail app password is correct
4. Check Vercel function logs for email errors

### Domain not working?
1. Wait 24-48 hours for DNS propagation
2. Verify DNS records in GoDaddy match Vercel's requirements
3. Use [DNS Checker](https://dnschecker.org) to verify propagation

## 📱 **Features Included**

- ✅ Responsive design (mobile-friendly)
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Spam protection via basic validation
- ✅ CORS headers for cross-origin requests
- ✅ Rate limiting friendly
- ✅ Accessible form design

## 🎉 **You're All Set!**

Your website is now ready for production with:
1. **Fast global CDN** via Vercel
2. **Working contact form** with backend
3. **Professional email notifications**
4. **Automatic deployments** on git push
5. **HTTPS encryption** automatically enabled

Need help? Check Vercel's documentation or the function logs for any issues. 