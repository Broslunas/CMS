# Shared Repository Permissions

## Overview
When a repository is shared with another user, they gain **collaborative access** to the content. This document explains how permissions work for shared repositories.

## Data Model

### Storage Location
- **Owned Projects**: Data stored in `user_{OWNER_ID}` collection
- **Shared Projects**: 
  - Reference stored in `user_{PARTICIPANT_ID}` collection as `shared_project_reference`
  - Actual data (posts, schemas) stored in `user_{OWNER_ID}` collection

### Post Ownership
When a shared user creates or edits a post:
- **userId**: Set to the owner's ID (for data ownership and organization)
- **authorId**: Set to the current user's ID (for audit trail)

## Permissions for Shared Repository Users

### ✅ What Shared Users CAN Do

1. **View Content**
   - View all posts in the shared repository
   - View repository settings and configuration
   - View Vercel deployment status (if configured by owner)

2. **Edit Content**
   - Create new posts in the repository
   - Edit existing posts
   - Delete posts

3. **Publish to GitHub**
   - Commit changes to GitHub using their own GitHub access token
   - Create files in the repository
   - Update files in the repository
   - Delete files from the repository
   - **Note**: GitHub permissions are checked independently. The user must have write access to the GitHub repository.

4. **View Schema & Collections**
   - View all content type schemas
   - View collection definitions
   - Import templates from existing posts

### ❌ What Shared Users CANNOT Do

1. **Repository Management**
   - Cannot delete the repository (they can only "leave" it)
   - Cannot modify repository settings
   - Cannot configure Vercel deployments
   - Cannot share the repository with others

2. **GitHub Settings**
   - Cannot modify GitHub App installation
   - Cannot change repository connection settings

## GitHub Commit Behavior

### How Commits Work for Shared Users

When a shared user commits changes to GitHub:

1. **Authentication**: Uses the shared user's own GitHub access token
2. **Author Attribution**: GitHub commit shows the shared user as the author
3. **Permission Check**: GitHub verifies the user has write access to the repository
4. **Storage**: Post data is stored in the owner's collection, but the commit is made by the shared user

### GitHub Permissions Required

For shared users to commit to GitHub, they must:

1. Have the GitHub App installed on their account
2. Be granted write access to the repository by the repository owner (via GitHub, not the CMS)
3. Have accepted any pending invitations to collaborate on the repository

### Permission Errors

If a shared user tries to commit without proper GitHub permissions:
- **Error Code**: 403 (Forbidden)
- **Error Type**: `PERMISSION_ERROR`
- **Message**: "Permission denied on GitHub" or "Resource not accessible by integration"
- **Resolution**: Owner must grant GitHub repository access to the shared user

## API Endpoints

### Create Post (`POST /api/posts/create`)
- ✅ Works for shared repositories
- Uses owner's collection for storage
- Uses current user's GitHub token for commits
- Sets `userId` to owner, `authorId` to current user

### Update Post (`PUT /api/posts/update`)
- ✅ Works for shared repositories
- Updates post in owner's collection
- Uses current user's GitHub token for commits

### Delete Post (`POST /api/posts/delete`)
- ✅ Works for shared repositories
- Deletes from owner's collection
- Uses current user's GitHub token for GitHub deletion

### Vercel Deployments (`GET /api/vercel/deployments`)
- ✅ Shared users can view owner's deployments
- Uses owner's Vercel configuration

### Vercel Settings (`PATCH /api/repo/settings`)
- ❌ Shared users cannot modify Vercel settings
- Returns 403 error if attempted

## Example Workflow

### Scenario: User B is granted access to User A's repository

1. **User A (Owner)**:
   - Shares repository `owner/repo` with User B via email/username
   - Grants User B write access on GitHub (via GitHub UI)

2. **User B (Shared User)**:
   - Sees the shared repository in their dashboard with "Shared" badge
   - Can view and edit all posts
   - Creates a new post and commits it
   - GitHub commit shows "User B committed X minutes ago"
   - Post data is stored in User A's database collection
   - Post shows `authorId: user_b_id` for audit purposes

3. **Both Users**:
   - Can see all posts in the repository
   - Can see each other's edits
   - Can view deployment status if configured

## Security Considerations

1. **Data Isolation**: Shared users never have direct access to the owner's database collection. All access is mediated through API endpoints that verify permissions.

2. **GitHub Security**: GitHub repository permissions are independent and must be managed separately on GitHub.

3. **Audit Trail**: All shared user actions are tracked via `authorId` field.

4. **Token Security**: Each user's GitHub access token is stored encrypted and used only for their own actions.

## Troubleshooting

### "Post not found" error
- The shared reference might be broken
- The owner may have deleted the repository
- Check that the shared_project_reference exists in your collection

### "Permission denied on GitHub"
- You don't have write access to the GitHub repository
- Ask the repository owner to grant you access on GitHub
- Ensure you've accepted any pending repository invitations

### Cannot see posts in shared repository
- Verify the shared_project_reference has the correct `ownerId` and `repoId`
- Check that the owner's collection contains the posts

### Deployment configuration not visible
- Only the owner can configure Vercel deployments
- You can view deployment status if the owner has configured it
