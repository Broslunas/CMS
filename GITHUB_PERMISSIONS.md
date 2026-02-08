# 🔐 GitHub App Configuration - Solving Error 403

## ❌ Current Error

```
Error: Resource not accessible by integration
Status: 403
```

**Cause:** GitHub OAuth Apps **DO NOT have permissions** to write to repositories.

---

## ✅ Solution: Create a GitHub App

### Step 1: Create the GitHub App

1. **Go to:** https://github.com/settings/apps/new

2. **Configure the fields:**

```
GitHub App name: Broslunas CMS-CMS-App
Description: CMS for managing Astro content via Git
Homepage URL: http://localhost:3000
```

3. **Callback URL:**
```
http://localhost:3000/api/auth/callback/github
```

4. **Webhook:**
```
☐ Active (leave it DISABLED)
```

5. **Repository Permissions:**

Scroll to "Repository permissions":

```
Contents: Read and write     ✅ VERY IMPORTANT
Metadata: Read-only          ✅ Automatic
```

6. **Where can this GitHub App be installed?**
```
● Only on this account
```

7. **Click "Create GitHub App"**

---

### Step 2: Configure Credentials

1. **After creation, you will see the settings page.**

2. **Client ID:**
   - Copy the "Client ID" (it is visible).

3. **Client secrets:**
   - Click "Generate a new client secret".
   - **COPY THE SECRET IMMEDIATELY** (it is only shown once).

4. **Private key (NOT required for the OAuth flow):**
   - You do not need this for this case.

---

### Step 3: Update .env.local

Update your `.env.local` file:

```bash
# MongoDB
MONGODB_URI=your-mongodb-uri-here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# GitHub App (NEW VALUES)
GITHUB_ID=your_new_client_id_here
GITHUB_SECRET=your_new_client_secret_here
```

---

### Step 4: Install the App on your account

1. **Go to:** Settings of your GitHub App.
2. **Click on "Install App" (left sidebar).**
3. **Select your account.**
4. **Choose:**
   - ● All repositories (or)
   - ○ Only select repositories (select your Astro repos)
5. **Click "Install"**

---

### Step 5: Test

1. **Restart the server:**
```bash
npm run dev
```

2. **Logout and log back in:**
   - This will generate a new access token with the correct permissions.

3. **Try making a commit:**
   - It should now work ✅.

---

## 🔍 Differences: OAuth App vs GitHub App

| Feature | OAuth App | GitHub App |
|---------|-----------|------------|
| **Write Permissions** | ❌ Limited | ✅ Full |
| **Granular Scopes** | ❌ No | ✅ Yes |
| **Rate Limit** | 5,000/hour | 15,000/hour |
| **Best For** | Read-only | CMS, CI/CD |

---

## 🚨 Troubleshooting

### Error: "App is not installed"

**Solution:**
1. Go to https://github.com/settings/installations.
2. Verify that your App is installed.
3. Re-install if necessary.

### Error: "Invalid client_id"

**Solution:**
1. Verify that you copied the correct Client ID.
2. Do not confuse the Client ID with the App ID.
3. Restart the server after changing `.env.local`.

### Still getting error 403

**Solution:**
1. Verify that permissions are "Read and write" (not just "Read").
2. Ensure you have installed the app on your account.
3. Logout and log back in to the CMS.

---

## 📝 Permission Verification

To ensure everything is correctly configured:

1. **Go to your GitHub App:**
   - `https://github.com/settings/apps/[your-app-name]`

2. **Check in "Permissions":**
   ```
   Repository permissions:
   ✅ Contents: Read & write
   ✅ Metadata: Read-only
   ```

3. **Check in "Install App":**
   - It must appear as installed on your account.
   - It must have access to your Astro repos.

---

## ✅ Final Checklist

Before testing:

- [ ] GitHub App created.
- [ ] Client ID copied.
- [ ] Client Secret generated and copied.
- [ ] "Contents: Read & write" permissions enabled.
- [ ] App installed on your GitHub account.
- [ ] `.env.local` updated with new credentials.
- [ ] Server restarted.
- [ ] Session closed and restarted in the CMS.

---

## 🎯 Expected Result

After these steps:

✅ You will be able to import repos.  
✅ You will be able to edit posts.  
✅ You will be able to make commits to GitHub.  
✅ No more 403 errors.

---

## 💡 Important Note

**GitHub Apps** are the modern and recommended way to integrate with GitHub. They are more secure and have better permissions than traditional OAuth Apps.

**For production:**
- Change the URLs from `localhost:3000` to your real domain.
- Regenerate the `NEXTAUTH_SECRET` for production.
- Consider using separate environment variables for dev and prod.
