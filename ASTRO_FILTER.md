# 🚀 Astro Repository Filter

## ✅ Implemented

The import modal now **only shows repositories using Astro**, making the workflow cleaner and preventing errors from importing incompatible repositories.

---

## 🔍 Astro Detection

### Method:
A repository is verified to have **Astro installed** by checking its `package.json`:

```typescript
// Look for "astro" in dependencies or devDependencies
{
  "dependencies": {
    "astro": "^4.0.0"  // ✅ Detected
  }
}

// Or in devDependencies
{
  "devDependencies": {
    "astro": "^4.0.0"  // ✅ Detected
  }
}
```

---

## 📦 Added Function

### `isAstroRepo()` in `lib/octokit.ts`

```typescript
export async function isAstroRepo(
  accessToken: string,
  owner: string,
  repo: string
): Promise<boolean>
```

**Operation:**
1. Fetches `package.json` from the repository.
2. Reads `dependencies` and `devDependencies`.
3. Returns `true` if "astro" is found.
4. Returns `false` if `package.json` doesn't exist or doesn't have Astro.

**Error Handling:**
- If `package.json` does not exist → `false`
- If there is a permissions error → `false`
- If the JSON is invalid → `false`

---

## 🔌 Updated API

### `/api/repos` - Now filters automatically

**Before:**
```typescript
// Returned ALL repositories
return NextResponse.json(repos);
```

**After:**
```typescript
// Filters only repositories with Astro
const astroRepos = [];

for (const repo of repos) {
  const [owner, repoName] = repo.full_name.split("/");
  const usesAstro = await isAstroRepo(accessToken, owner, repoName);
  
  if (usesAstro) {
    astroRepos.push(repo);
  }
}

return NextResponse.json(astroRepos);
```

---

## 🎨 Improved UX

### Import Modal

**Updated Header:**
```
┌─────────────────────────────┐
│ Import Repository           │
│ Only Astro repositories     │ ← New text
└─────────────────────────────┘
```

**Improved Empty State:**
```
No Astro repositories found.
Make sure you have repositories with Astro 
in your GitHub account.
```

---

## ⚡ Performance

### Optimization:
- Filtering is done **server-side** (API route).
- The client only receives valid repos.
- No unnecessary requests.

### Considerations:
- For 100 repos, it makes ~100 calls to the GitHub API.
- Executed sequentially to avoid rate limits.
- GitHub has a limit of 5000 requests/hour (sufficient).

### Future Potential Improvements:
- [ ] Cache `isAstroRepo()` results.
- [ ] Run checks in parallel (batch).
- [ ] Save an "isAstro" flag in the DB upon import.

---

## 🎯 Benefits

1. ✅ **Error Prevention**: Repos without Astro cannot be imported.
2. ✅ **Improved UX**: Smaller and more relevant list.
3. ✅ **Clarity**: Users know these are only Astro repositories.
4. ✅ **Professional**: The CMS is specialized in Astro.

---

## 📊 Detection Examples

### ✅ Detected as Astro:
```json
// Portfolio with Astro
{
  "dependencies": {
    "astro": "^4.3.0"
  }
}

// Blog with Astro in devDeps
{
  "devDependencies": {
    "astro": "^3.6.0"
  }
}
```

### ❌ NOT detected:
```json
// React Project (without Astro)
{
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0"
  }
}

// Project without package.json
// (Static HTML, etc.)
```

---

## 🔧 Testing

To test:
1. Ensure you have repos with and without Astro.
2. Open the import modal.
3. Only the Astro ones should appear.
4. If you have no Astro repos, you will see the empty state message.

---

## ✅ Build Status

- **TypeScript**: ✅ No errors
- **Build**: ✅ Successful
- **Modified files**: 2
- **New function**: `isAstroRepo()`

---

**Result**: A smart modal that only shows repositories compatible with Astro, improving the experience and avoiding errors. 🚀✨
