# 🎯 Quick Setup Guide - Broslunas CMS

## Step 1: MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account.
3. Click "Build a Database" → Select M0 (Free).
4. Choose a provider (AWS, Google Cloud, Azure).
5. Click "Create".
6. In "Security Quickstart":
   - Username: `astrocms`
   - Password: Generate a secure password (and save it!).
7. In "Where would you like to connect from?":
   - Click "Add My Current IP Address".
   - Or add `0.0.0.0/0` to allow all IPs (for development only).
8. Click "Finish and Close".
9. Click "Connect" → "Connect your application".
10. Copy the connection string:
    ```
    mongodb+srv://astrocms:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
11. Replace `<password>` with your actual password.

## Step 2: GitHub App

1. Go to https://github.com/settings/apps/new
2. Fill out the form:
   ```
   GitHub App name: Broslunas CMS Local
   Homepage URL: http://localhost:3000
   Callback URL: http://localhost:3000/api/auth/callback/github
   ```
3. Set **Repository Permissions**:
   - **Contents**: `Read and write`
4. Click "Create GitHub App".
5. **Save your Client ID** (it appears immediately).
6. Click "Generate a new client secret".
7. **Save your Client Secret** (it's only shown once!).
8. **Save the App Slug** (used for `GITHUB_APP_NAME`).

## Step 3: Environment Variables

Create a `.env` file in the root of the project:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://astrocms:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/astro-cms?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET

# GitHub App
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GITHUB_APP_NAME=your-github-app-slug
```

### Generating NEXTAUTH_SECRET

**On Windows (Git Bash or WSL):**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Online (if you don't have OpenSSL):**
Visit: https://generate-secret.vercel.app/32

## Step 4: Install and Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## ✅ Verification

1. Does the landing page open? ✓
2. Does "Continue with GitHub" work? ✓
3. Are you redirected to the dashboard after login? ✓
4. Can you see your repositories? ✓

## 🐛 Common Issues

### Error: "MongooseServerSelectionError"
- Verify that your IP is allowed in MongoDB Atlas.
- Check that the password in the URI is correct (no unencoded special characters).

### Error: "OAuthCallbackError"
- Ensure that the callback URLs in GitHub match exactly.
- Verify that `GITHUB_ID` and `GITHUB_SECRET` are correct.

### Error: "No repositories found"
- Confirm that you have repositories in your GitHub account.
- Note: Private repositories require the `repo` scope (already configured) and the app to be installed correctly.

## 📞 Support

If you encounter problems, check:
1. Server logs in the terminal.
2. Browser console (F12).
3. The main `README.md` for full documentation.
