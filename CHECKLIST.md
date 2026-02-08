# ✅ Setup Checklist

Follow these steps to get the CMS up and running:

## 1️⃣ MongoDB Atlas (5 minutes)

- [ ] Go to https://www.mongodb.com/cloud/atlas/register
- [ ] Create a free account
- [ ] Create an M0 cluster (free)
- [ ] Create a database user
- [ ] Allow access from your IP (or 0.0.0.0/0 for development)
- [ ] Copy the connection string

## 2️⃣ GitHub App (3 minutes)

- [ ] Go to https://github.com/settings/apps/new
- [ ] Create a new GitHub App
- [ ] Configure the callback URL: `http://localhost:3000/api/auth/callback/github`
- [ ] Set **Repository Permissions** for **Contents** to `Read and write`
- [ ] Save the Client ID
- [ ] Generate and save the Client Secret
- [ ] Copy the App Slug/Name

## 3️⃣ Environment Variables (2 minutes)

- [ ] Create a `.env` file in the root
- [ ] Copy the contents from `.env.example`
- [ ] Fill in `MONGODB_URI` with your connection string
- [ ] Fill in `GITHUB_ID`, `GITHUB_SECRET`, and `GITHUB_APP_NAME`
- [ ] Generate a `NEXTAUTH_SECRET` (see SETUP.md)

## 4️⃣ Run (1 minute)

```bash
npm run dev
```

- [ ] Open http://localhost:3000
- [ ] Click on "Continue with GitHub"
- [ ] ✨ Success!

---

**Estimated total time**: 10-15 minutes

📖 For detailed instructions, see: `SETUP.md`
