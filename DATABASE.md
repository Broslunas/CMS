# 🗄️ Database Structure - MongoDB

## Database: `astro-cms`

---

## 📊 Collections

### 1. **Collection: `posts`**

Stores each Markdown file imported from the repositories.

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: String,              // GitHub user ID
  repoId: String,              // "owner/repo"
  filePath: String,            // "src/content/blog/post/index.md"
  sha: String,                 // File SHA on GitHub
  metadata: {
    title: String,
    slug: String,
    tags: Array<String>,
    episodeUrl: String,
    transcription: Array<{
      time: String,
      text: String
    }>
  },
  content: String,             // Markdown content
  status: String,              // "synced" | "modified" | "draft"
  lastCommitAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1, repoId: 1, filePath: 1 } // Unique
```

**Operations:**
- **Create/Update**: `/api/import` (import repo)
- **Update**: `/api/posts/update` (edit post)
- **Read**: `/api/posts` (list posts)

---

### 2. **Collection: `projects`**

Stores information about each imported repository.

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: String,              // GitHub user ID
  repoId: String,              // "owner/repo" (unique per user)
  name: String,                // Repository name
  description: String,         // Repo description
  postsCount: Number,          // Number of imported posts
  lastSync: Date,              // Last synchronization
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
{ userId: 1, repoId: 1 } // Unique
```

**Operations:**
- **Create/Update**: `/api/import` (when importing posts)
- **Read**: `/api/projects` (list projects)

---

### 3. **Collection: `users`** (NextAuth)

Automatically created by NextAuth with the MongoDB Adapter.

**Basic Schema:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String,
  emailVerified: Date
}
```

---

### 4. **Collection: `accounts`** (NextAuth)

Stores linked OAuth accounts.

**Basic Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to users
  type: "oauth",
  provider: "github",
  providerAccountId: String,
  access_token: String,       // Token for GitHub API
  token_type: "bearer",
  scope: String
}
```

---

### 5. **Collection: `sessions`** (NextAuth)

Stores active sessions.

**Basic Schema:**
```javascript
{
  _id: ObjectId,
  sessionToken: String,
  userId: ObjectId,
  expires: Date
}
```

---

## 🔗 Relationships

```
users (NextAuth)
  ├── _id
  └── 1:N → accounts
            └── access_token (used for GitHub API)

users._id
  └── 1:N → projects
            └── userId
            └── 1:N → posts
                      └── userId + repoId
```

---

## 📍 Data Flow

### Import Repository:

```
1. User clicks "Import" in the modal
   ↓
2. POST /api/import
   ↓
3. Gets access_token from the session (NextAuth)
   ↓
4. Calls GitHub API to list .md files
   ↓
5. For each file:
   - Gets content
   - Parses frontmatter
   - Validates with Zod
   - Upsert into "posts" collection
   ↓
6. Upsert into "projects" collection
   - Saves repo metadata
   - Updates postsCount
   - Updates lastSync
   ↓
7. Returns result to the client
```

### Edit Post:

```
1. User edits in the editor
   ↓
2. Clicks "Save" or "Save & Commit"
   ↓
3. PUT /api/posts/update
   ↓
4. Updates in "posts" collection
   └─ If commitToGitHub = true:
      ├── Calls GitHub API (createOrUpdateFile)
      ├── Updates SHA
      └── Marks status = "synced"
   └─ If commitToGitHub = false:
      └── Marks status = "modified"
```

---

## 🔍 Useful Queries

### View all posts for a user:
```javascript
db.posts.find({ userId: "github_12345" })
```

### View posts for a specific repository:
```javascript
db.posts.find({ 
  userId: "github_12345",
  repoId: "Broslunas/portfolio-old"
})
```

### View projects imported by a user:
```javascript
db.projects.find({ userId: "github_12345" })
  .sort({ updatedAt: -1 })
```

### Count posts pending sync:
```javascript
db.posts.countDocuments({
  userId: "github_12345",
  status: "modified"
})
```

### View unsynced posts:
```javascript
db.posts.find({
  userId: "github_12345",
  status: { $ne: "synced" }
})
```

---

## 📊 Statistics

### Total posts per user:
```javascript
db.posts.aggregate([
  { $match: { userId: "github_12345" } },
  { $group: { 
      _id: "$userId", 
      total: { $sum: 1 } 
  }}
])
```

### Posts per project:
```javascript
db.posts.aggregate([
  { $match: { userId: "github_12345" } },
  { $group: { 
      _id: "$repoId", 
      count: { $sum: 1 } 
  }}
])
```

---

## 🛠️ Maintenance

### Delete a project and its posts:
```javascript
// 1. Delete posts
db.posts.deleteMany({ 
  userId: "github_12345",
  repoId: "owner/repo" 
})

// 2. Delete project
db.projects.deleteOne({ 
  userId: "github_12345",
  repoId: "owner/repo" 
})
```

### Clean up orphaned posts:
```javascript
// Posts without an associated project
db.posts.deleteMany({
  repoId: { 
    $nin: db.projects.distinct("repoId") 
  }
})
```

---

## ⚠️ Important

1. **Do not manually delete** data from `users`, `accounts`, or `sessions` - these are handled by NextAuth.
2. **Use upsert** instead of insert to avoid duplicates.
3. **Validate with Zod** before saving data to `posts`.
4. **Update `postsCount`** when modifying posts in a project.

---

## 🔐 Security

All queries include `userId` to ensure:
- Users only see their own data.
- There is no cross-access between users.
- Privacy is maintained.

```javascript
// ✅ CORRECT
db.posts.find({ userId: session.user.id, repoId: "owner/repo" })

// ❌ INCORRECT (without user filter)
db.posts.find({ repoId: "owner/repo" })
```

---

## 📝 Summary

- **`posts`**: Markdown files (content)
- **`projects`**: Imported repositories (metadata)
- **`users`**: Authenticated users (NextAuth)
- **`accounts`**: OAuth connections (NextAuth)
- **`sessions`**: Active sessions (NextAuth)

**Total**: 5 collections in the `astro-cms` database
