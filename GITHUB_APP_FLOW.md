# 🔐 GitHub App Installation Flow - New Users

## 📋 Overview

When a new user registers with the CMS, they first obtain basic access to their account (email, name, photo) through GitHub OAuth. However, to manage content, **they must install the GitHub App**, which grants the necessary permissions to read and write to their repositories.

---

## 🔄 Complete New User Flow

### 1. **Login (GitHub OAuth)**

```
User → Clicks "Login with GitHub"
    ↓
NextAuth → Authenticates with GitHub OAuth
    ↓
User → Obtains a session with:
    - ✅ Email
    - ✅ Name
    - ✅ Profile Picture
    - ✅ Access Token
    - ❌ GitHub App NOT installed (appInstalled: false)
```

### 2. **Automatic Verification**

```
Session created
    ↓
auth.ts (callback) → Checks if the app is installed
    ↓
checkAppInstalled() → Queries GitHub API
    ↓
session.appInstalled = false
```

### 3. **Redirection to Setup**

```
User tries to access /dashboard
    ↓
Dashboard page → Verifies session.appInstalled
    ↓
appInstalled === false → redirect("/setup")
```

### 4. **Setup Page (/setup)**

The user sees a guided page with:

- **Step-by-step instructions** to install the app
- **Install button** that opens GitHub in a new tab
- **Automatic verification** every 3 seconds

```tsx
Setup Page shows:
  1. Install the GitHub App
  2. Select your repositories  
  3. Start working!

Button: "Install GitHub App"
  → Opens: https://github.com/apps/{GITHUB_APP_NAME}/installations/new
```

### 5. **Installation on GitHub**

```
User clicks "Install GitHub App"
    ↓
GitHub → Shows the installation page
    ↓
User selects:
    - [ ] All repositories
    - [ ] Only select repositories
    ↓
User clicks "Install"
    ↓
GitHub → Installs the app
    ↓
User closes the tab / returns to the CMS
```

### 6. **Automatic Detection**

While the user is on `/setup`:

```
InstallationChecker (component)
    ↓
Every 3 seconds:
    → fetch('/api/check-installation')
    → checkAppInstalled(access_token)
    → Queries GitHub API
    ↓
If installed === true:
    → router.push('/dashboard')
    → router.refresh() // Refreshes the session
```

### 7. **Dashboard Access**

```
User redirected to /dashboard
    ↓
auth() → New session with appInstalled: true
    ↓
Dashboard → Displays projects
    ↓
User can:
    ✅ Import repositories
    ✅ Edit posts
    ✅ Commit to GitHub
```

---

## 🏗️ Implemented Architecture

### **Created/Modified Files**

#### 1. **lib/github-app.ts** (New)
Utilities to verify the installation:

```typescript
- checkAppInstalled(accessToken: string): Promise<boolean>
  → Verifies if the user has the app installed
  
- getAppInstallUrl(): string
  → Generates the installation URL
  
- getInstallationId(accessToken: string): Promise<number | null>
  → Retrieves the installation ID (for future use)
```

#### 2. **app/setup/page.tsx** (New)
Initial setup page:

- Shows step-by-step instructions.
- Provides a button to install the app.
- Includes an automatic verification component.
- Features a clear and premium design.

#### 3. **components/InstallationChecker.tsx** (New)
Client-side component that:

- Polls every 3 seconds.
- Verifies the `/api/check-installation` endpoint.
- Automatically redirects when it detects the installation.
- Displays a "Verifying installation..." indicator.

#### 4. **app/api/check-installation/route.ts** (New)
API Endpoint:

```typescript
GET /api/check-installation
Response: {
  installed: boolean,
  message: string
}
```

#### 5. **lib/auth.ts** (Modified)
Updated session callback:

```typescript
async session({ session, token }) {
  // ... existing code ...
  
  // Verify app installation
  if (session.access_token) {
    session.appInstalled = await checkAppInstalled(session.access_token);
  }
  
  return session;
}
```

#### 6. **app/dashboard/page.tsx** (Modified)
Added verification:

```typescript
if (!session.appInstalled) {
  redirect("/setup");
}
```

#### 7. **types/next-auth.d.ts** (Modified)
Extended type:

```typescript
interface Session {
  user: { id: string } & DefaultSession["user"];
  access_token?: string;
  appInstalled?: boolean; // 🆕
}
```

#### 8. **.env + .env.example** (Modified)
New variable:

```bash
GITHUB_APP_NAME=broslunas-cms
```

---

## 🔍 Technical Verifications

### **How is the installation verified?**

```typescript
// lib/github-app.ts
const { data: installations } = await octokit.request('GET /user/installations');

const ourApp = installations.installations.find(
  (installation) => installation.app_slug === process.env.GITHUB_APP_NAME
);

return !!ourApp; // true if installed
```

### **When is the state updated?**

1. **At login** → `auth.ts` callback verifies automatically.
2. **On page reload** → The session is regenerated and verified again.
3. **On /setup** → Polling occurs every 3 seconds.
4. **When navigating to /dashboard** → Server-side verification before rendering.

---

## 🎯 Benefits of the Flow

### ✅ **Security**
- Granular permissions (only selected repos).
- Token with the correct scope.
- Verification on every critical request.

### ✅ **Improved UX**
- Automatic installation detection.
- No need for manual refreshing.
- Clear and visual instructions.
- Real-time feedback.

### ✅ **Scalable**
- Easy to add more checks.
- Reusable for other features.
- Clear separation of concerns.

---

## 🚨 Edge Cases

### **User already has the app installed**

```
Login → auth callback verifies
  ↓
appInstalled = true
  ↓
Redirects directly to /dashboard
```

### **User installs the app but does not reload**

```
InstallationChecker → Polling is active
  ↓
Detects installation
  ↓
Redirects automatically
```

### **User subsequently uninstalls the app**

```
Next login → checkAppInstalled() returns false
  ↓
session.appInstalled = false
  ↓
Redirects back to /setup
```

### **GitHub API Error**

```
checkAppInstalled() → catch error
  ↓
return false (safe mode)
  ↓
User sees /setup
```

---

## 📊 User States

| State | appInstalled | Access To | Redirect To |
|-------|--------------|-----------|-------------|
| **Not logged in** | - | `/` | `/` |
| **Logged in without app** | `false` | `/setup` | `/setup` |
| **Logged in with app** | `true` | All | `/dashboard` |

---

## 🔧 Necessary Environment Variables

```bash
# GitHub OAuth (for authentication)
GITHUB_ID=your-github-app-client-id
GITHUB_SECRET=your-github-app-client-secret

# GitHub App Name (to verify installation)
GITHUB_APP_NAME=your-github-app-slug
```

**Important:** `GITHUB_APP_NAME` must be the app **slug** (the one that appears in the URL), not the display name.

Example:
- ❌ Display Name: "Broslunas CMS"
- ✅ App Slug: `broslunas-cms`

---

## 🎨 UI/UX of /setup

### **Design**
- Centered card with a background gradient.
- Prominent GitHub icon.
- 3 clearly numbered steps.
- Permissions section with a check icon.
- 2 action buttons (Install / I've already installed).

### **Behavior**
- Automatic background verification.
- Subtle "Verifying installation..." indicator.
- Smooth transitions upon redirection.

### **Responsive**
- Mobile-first approach.
- Stacked buttons on mobile.
- Horizontal layout on desktop.

---

## 🧪 Flow Testing

### **Test 1: New User**
1. Create a new GitHub account (or use incognito mode).
2. Login to the CMS → Should go to `/setup`.
3. Do not install the app → Should remain on `/setup`.
4. Click "Install GitHub App" → Should open GitHub.
5. Install the app + return to CMS → Should automatically redirect to `/dashboard`.

### **Test 2: Existing User**
1. Login with an account that already has the app.
2. Should go directly to `/dashboard`.
3. Should not see `/setup`.

### **Test 3: Uninstallation**
1. User with the app installed.
2. Go to GitHub → Uninstall the app.
3. Logout from the CMS.
4. Log back in → Should go to `/setup`.

---

## 📝 Possible Next Steps

### **Future Improvements**

1. **Installation Webhook**
   - GitHub can notify when the app is installed.
   - Eliminates the need for polling.
   - More efficient.

2. **Permissions Configuration Page**
   - Display which repositories have access.
   - Allow adding/removing repositories.
   - View installation ID.

3. **Automatic Synchronization**
   - Detect when new repositories are added.
   - Auto-import allowed repositories.
   - Notify about permission changes.

4. **Analytics**
   - Track how many users complete the setup.
   - Average installation time.
   - Abandonment rate during setup.

---

## ✅ Implementation Checklist

- [x] `GITHUB_APP_NAME` variable in .env.
- [x] Utilities in `lib/github-app.ts`.
- [x] `appInstalled` type in NextAuth.
- [x] Verification callback in `auth.ts`.
- [x] `/setup` page with instructions.
- [x] `InstallationChecker` component.
- [x] `/api/check-installation` endpoint.
- [x] Verification in `/dashboard`.
- [x] Complete documentation.

---

## 🎉 Final Result

**A complete and automatic flow** where:

1. ✅ New users are guided to install the app.
2. ✅ Automatic detection occurs without manual intervention.
3. ✅ Fluid UX with visual feedback.
4. ✅ Permission verification on every session.
5. ✅ Clean and maintainable code.
6. ✅ Scalable preparation.

**The CMS now explicitly requires the installation of the GitHub App before allowing content management.** 🚀
