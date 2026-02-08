# Technical Documentation: Broslunas CMS

## 1. Executive Summary

Broslunas CMS is a Git-based content management system (CMS) designed specifically for the Astro ecosystem. It allows users to manage their Content Collections through an intuitive visual interface, syncing data directly with their GitHub repositories without the need for external content databases, while using MongoDB as a cache and intermediate state persistence layer.

## 2. System Architecture

The information flow is based on a Bidirectional Synchronization model:

- **Authentication Layer**: NextAuth.js manages the OAuth flow with GitHub and persists the session in MongoDB.
- **Persistence Layer (Cache/State)**: MongoDB stores a copy of the parsed text files (Markdown/MDX) in JSON format for fast searching and fluid editing.
- **Communication Layer (Git)**: Octokit acts as the bridge between the Next.js server and the GitHub API to perform read and write operations (commits).

## 3. Data Model (MongoDB)

To support Astro's flexibility, we use a schema that divides "Frontmatter" from "Content".

**Collection**: `posts`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",      // Relation with NextAuth user
  "repoId": "String",        // ID or full name of the repo (owner/repo)
  "filePath": "String",      // Relative path in the repo: "src/content/blog/post.md"
  "sha": "String",           // Current SHA of the file on GitHub (vital for updates)
  
  // Structured Frontmatter
  "metadata": {
    "title": "String",
    "slug": "String",
    "tags": ["String"],
    "episodeUrl": "String",
    "transcription": [{
      "time": "String",
      "text": "String"
    }]
  },
  
  "content": "String",       // Markdown body (after the second ---)
  "status": "synced" | "draft" | "modified",
  "lastCommitAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 4. Main Logical Flows

### A. Initial Synchronization (Import)

When a user links a repository:

1. **Scan**: The application traverses `src/content/` looking for `.md` or `.mdx` files.
2. **Parsing**: For each file, the raw content is downloaded.
3. **Extraction**: The `gray-matter` library is used to separate Frontmatter from content.
4. **Upsert**: The document is saved/updated in MongoDB with the SHA provided by the GitHub API.

### B. Editing and Saving Process

1. **UI Editing**: The user modifies the transcription array in a dynamic form.
2. **DB Saving**: The document is updated in MongoDB immediately (state: `modified`).
3. **Serialization (JSON to Markdown)**:
   - The metadata object is taken and converted to YAML.
   - It is concatenated with the content.
4. **GitHub Commit**:
   - The new base64 content is sent to the GitHub API.
   - GitHub returns a new SHA.
   - The document in MongoDB is updated with the new SHA and state: `synced`.

## 5. Implementation with Next.js

### NextAuth.js Integration

It is essential to configure the necessary scopes so the application can perform commits.

```javascript
// Required Scope: 'repo' or 'public_repo'
GitHubProvider({
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  authorization: { params: { scope: 'repo' } },
})
```

### Markdown Serializer (Core Logic)

Since you want to handle complex data types, the serializer must be robust:

```javascript
import matter from 'gray-matter';

/**
 * Converts MongoDB data to Astro's physical file format
 */
function serializePost(postData) {
  const { metadata, content } = postData;
  
  // matter.stringify generates the frontmatter --- block and joins it to the content
  return matter.stringify(content, metadata);
}
```

## 6. Technical Challenges and Solutions

| Challenge | Suggested Solution |
| :--- | :--- |
| **Editing Conflicts** | When committing, always send the SHA stored in MongoDB. If GitHub returns a 409 (Conflict) error, it means someone edited the file outside the CMS; the user should be asked to refresh the data. |
| **GitHub Rate Limits** | Use MongoDB for all UI reads. Only query the GitHub API during the initial import or when forcing a sync. |
| **Astro Typing** | Implement Zod validation on the Next.js server that replicates the user's Content Collections `config.ts` to avoid build errors in production. |
| **Image Management** | Allow image uploads to a `/public/assets/cms/` folder in the repo using the same commit flow, returning the relative path for the Markdown. |

## 7. Development Roadmap

### Phase 1: MVP (2-3 weeks)

- [x] Configuration of Next.js, NextAuth, and MongoDB.
- [x] Connection with Octokit and repository listing.
- [x] Basic Markdown file import to MongoDB.
- [x] Simple text editor + Basic metadata editing (title, slug).

### Phase 2: Advanced Functionality

- [x] Implementation of dynamic forms for transcription and tags.
- [x] Automatic commit logic on save.
- [x] Synchronization status dashboard.

### Phase 3: UX and Optimization

- [ ] GitHub webhooks for real-time updates.
- [x] Media Library (image management).
- [ ] Live preview (integration with Vercel/Netlify previews).