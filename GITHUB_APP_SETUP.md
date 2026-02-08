# 🔧 GitHub App Configuration - Step-by-Step Guide

## 📝 Before You Begin

This guide is for **creating the GitHub App for the first time**. If you have already created it, you only need the slug for `GITHUB_APP_NAME`.

---

## 1️⃣ Create the GitHub App

### Step 1: Go to the creation page

**URL**: https://github.com/settings/apps/new

### Step 2: Fill out the form

#### **Basic Information**

| Field | Value |
|-------|-------|
| **GitHub App name** | `Broslunas CMS` (or your preferred name) |
| **Description** | `Content management system for static sites` |
| **Homepage URL** | `http://localhost:3000` (dev) or `https://your-domain.com` (prod) |

#### **Identifying and authorizing users**

| Field | Value |
|-------|-------|
| **Callback URL** | `http://localhost:3000/api/auth/callback/github` |
| **Request user authorization (OAuth) during installation** | ✅ **CHECK** |
| **Enable Device Flow** | ❌ Leave unchecked |

#### **Post installation**

| Field | Value |
|-------|-------|
| **Setup URL (optional)** | Leave blank |
| **Redirect on update** | ❌ Leave unchecked |

#### **Webhook**

| Field | Value |
|-------|-------|
| **Active** | ❌ **UNCHECK** (webhooks are not needed for now) |

---

## 2️⃣ Configure Permissions

### Repository permissions

Scroll to the **"Permissions"** section and configure:

| Permission | Access | Why? |
|---------|--------|-----------|
| **Contents** | `Read and write` | To read and write files in repositories |
| **Metadata** | `Read-only` | (Automatically enabled) |

**⚠️ IMPORTANT**: Ensure that **Contents** is set to **Read and write**, not just Read.

### Account permissions

Set all to **No access** (they are not required).

---

## 3️⃣ Configure Installation

### Where can this GitHub App be installed?

Options:
- ✅ **Any account** (if you want others to install your app)
- ✅ **Only on this account** (only for you - **RECOMMENDED for dev**)

Select: **Only on this account**

---

## 4️⃣ Create the App

Click the green **"Create GitHub App"** button at the end of the form.

---

## 5️⃣ Obtain Credentials

After creating the app, you will see the configuration page:

### Client ID

Visible on the page:
```
Client ID: Iv23liABCDEFGHIJKL (example)
```

**Action**: Copy it.

### Client Secret

1. Scroll to the **"Client secrets"** section.
2. Click on **"Generate a new client secret"**.
3. **⚠️ IMPORTANT**: Copy the secret **IMMEDIATELY** (it is only shown once).

```
Secret: ghp_abcdefgh123456789... (example)
```

### App Slug

The slug can be found in the page URL:

```
https://github.com/settings/apps/broslunas-cms
                                    ^^^^^^^^^^^^
                                    This is the slug
```

**OR** it is visible in the **"Basic information"** section as **"App slug"**.

---

## 6️⃣ Update .env

Copy the credentials into your `.env` file:

```bash
# MongoDB
MONGODB_URI="mongodb+srv://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"

# GitHub App
GITHUB_ID="Iv23liABCDEFGHIJKL"           # ← Client ID
GITHUB_SECRET="ghp_abcdefgh123456789..."  # ← Client Secret
GITHUB_APP_NAME="broslunas-cms"           # ← App Slug
```

---

## 7️⃣ Install the App on Your Account

### Option A: From the app page

1. On your GitHub App configuration page.
2. Left sidebar → **"Install App"**.
3. Click **"Install"** next to your account.
4. Select repositories:
   - ✅ **All repositories**
   - ⭕ **Only select repositories** (specific ones)
5. Click **"Install"**.

### Option B: From the direct URL

Visit: `https://github.com/apps/[your-app-slug]/installations/new`

Example: `https://github.com/apps/broslunas-cms/installations/new`

---

## 8️⃣ Verify the Installation

### On GitHub

1. Go to: https://github.com/settings/installations
2. You should see your app listed.

### In the CMS

1. Restart the development server:
   ```bash
   npm run dev
   ```

2. Logout if you were already logged in.

3. Log back in.

4. You should go **directly to the dashboard** (not to /setup) if the app is installed.

---

## 9️⃣ Testing

### Test 1: Verify that the app is installed

```bash
# In another terminal, with the server running:
curl http://localhost:3000/api/check-installation

# You need to be logged in for this to work
# Expected response:
# {"installed":true,"message":"GitHub App installed correctly"}
```

### Test 2: Test the complete flow

1. **Open in incognito mode** (to simulate a new user).
2. Login with GitHub.
3. If you have already installed the app → Go to `/dashboard`.
4. If you have not installed it → Go to `/setup`.

---

## 🔄 Update for Production

When you deploy to production:

### 1. Update URLs in GitHub App

1. Go to your GitHub App configuration.
2. **"General"** section.
3. Update:
   - **Homepage URL**: `https://cms.yourdomain.com`
   - **Callback URL**: `https://cms.yourdomain.com/api/auth/callback/github`
4. Click **"Save changes"**.

### 2. Update environment variables

In your hosting platform (Vercel, Railway, etc.):

```bash
NEXTAUTH_URL="https://cms.yourdomain.com"
NEXTAUTH_SECRET="new-random-secret-for-production"
GITHUB_ID="Iv23li..." # (same as dev)
GITHUB_SECRET="ghp_..." # (same as dev)
GITHUB_APP_NAME="broslunas-cms" # (same as dev)
```

### 3. Change app visibility (optional)

If you want other users to install your app:

1. App configuration → **"General"**.
2. **"Where can this GitHub App be installed?"**.
3. Change to: **"Any account"**.
4. Click **"Save changes"**.

---

## 🚨 Troubleshooting

### Error: "App is not installed"

**Cause**: You have not installed the app into your GitHub account.

**Solution**: Go to step 7 and complete the installation.

### Error: "Invalid client_id"

**Cause**: The `GITHUB_ID` in `.env` does not match the app's Client ID.

**Solution**: 
1. Go to your GitHub App configuration.
2. Verify the Client ID.
3. Update your `.env`.
4. Restart the server.

### Error: "Resource not accessible by integration"

**Cause**: The app does not have the correct permissions.

**Solution**:
1. Go to your GitHub App configuration.
2. **"Permissions & events"** section.
3. Verify that **Contents** is set to **Read and write**.
4. If you changed permissions, you need to **re-install** the app:
   - GitHub → Settings → Applications → Installed Apps.
   - Click on your app → **"Configure"**.
   - Scroll to the bottom → Click **"Uninstall"**.
   - Re-install (Step 7).

### The /setup page does not redirect automatically

**Verify**:
1. The app is actually installed on GitHub.
2. The browser does not have DevTools open (which can pause polling).
3. Check the browser console for errors.
4. Verify that `/api/check-installation` is working.

---

## ✅ Final Checklist

Before considering the configuration complete:

- [ ] GitHub App created.
- [ ] Permissions: **Contents: Read and write** ✅.
- [ ] Client ID copied to `.env`.
- [ ] Client Secret generated and copied to `.env`.
- [ ] App Slug copied to `.env` as `GITHUB_APP_NAME`.
- [ ] App installed in your GitHub account.
- [ ] Server restarted after updating `.env`.
- [ ] Login works correctly.
- [ ] Flow from /setup → /dashboard works.
- [ ] You can import repositories.
- [ ] You can edit and save posts.

---

## 📚 Additional Resources

- [Official GitHub Apps Documentation](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps)
- [GitHub App Permissions](https://docs.github.com/en/rest/overview/permissions-required-for-github-apps)
- [NextAuth.js with GitHub](https://next-auth.js.org/providers/github)

---

**That's it!** Your GitHub App is fully configured and ready for production. 🚀
