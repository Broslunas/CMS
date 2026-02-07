import { auth } from "@/lib/auth";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";
import { updateFile, deleteFile, getFileContent } from "@/lib/octokit";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { serializeMarkdown } from "@/lib/markdown";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, newFilePath, renameOnGitHub } = await request.json();

    if (!postId || !newFilePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userCollection = db.collection(getUserCollectionName(session.user.id));
    
    // Fetch user settings for commit strategy
    const userSettings = await userCollection.findOne({ type: "settings" });
    const authorStrategy = userSettings?.githubCommitStrategy || "bot";
    
    // Find the post
    let post = await userCollection.findOne({ _id: new ObjectId(postId) });
    let targetCollection = userCollection;
    let effectiveUserId = session.user.id;

    // Check shared refs if not found
    if (!post) {
         const sharedRefs = await userCollection.find({ type: "shared_project_reference" }).toArray();
         for (const ref of sharedRefs) {
            const ownerCollection = db.collection(getUserCollectionName(ref.ownerId));
            const p = await ownerCollection.findOne({ _id: new ObjectId(postId) });
            if (p) {
                post = p;
                targetCollection = ownerCollection;
                effectiveUserId = ref.ownerId;
                const permissions = ref.permissions || [];
                // Rename is a 'manage' or 'write' operation? Let's say 'manage' for delete, 'create' for new?
                // Simple 'manage' usually covers critical actions.
                if (!permissions.includes("manage")) {
                     return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
                }
                break;
            }
        }
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check collision at destination
    const collision = await targetCollection.findOne({
        repoId: post.repoId,
        filePath: newFilePath,
        type: "post"
    });

    if (collision) {
        return NextResponse.json({ error: "File with this name already exists" }, { status: 409 });
    }

    const oldFilePath = post.filePath;
    let newSha = post.sha; // Start with old sha, but valid only if content matches?
                           // Actually if we rename on GitHub, we get a NEW sha.

    if (renameOnGitHub && post.sha && post.status === 'synced') {
        const accessToken = session.access_token as string;
        const [owner, repo] = post.repoId.split("/");

        try {
            // 1. Create file at new path with CURRENT content (from DB)
            const markdownContent = serializeMarkdown(post.metadata, post.content);
            const createRes = await updateFile(
                accessToken, 
                owner, 
                repo, 
                newFilePath, 
                markdownContent, 
                `Rename ${oldFilePath} to ${newFilePath} (Create)`,
                undefined,
                { authorStrategy }
            );

            // 2. Delete file at old path
            await deleteFile(
                accessToken,
                owner,
                repo,
                oldFilePath,
                post.sha,
                `Rename ${oldFilePath} to ${newFilePath} (Delete)`,
                { authorStrategy }
            );
            
            newSha = createRes.sha;

        } catch (e: any) {
            console.error("GitHub Rename Error", e);
            return NextResponse.json({ error: "Failed to rename on GitHub" }, { status: 500 });
        }
    } else {
        // If not renaming on GitHub, we lose the SHA linkage effectively, 
        // OR we treat it as a new draft.
        // It's safer to treat as "draft" with null SHA so we don't try to update the OLD file later.
        newSha = null;
    }

    // Update DB
    await targetCollection.updateOne(
        { _id: new ObjectId(postId) },
        { 
            $set: { 
                filePath: newFilePath,
                updatedAt: new Date(),
                sha: newSha,
                status: (renameOnGitHub && post.sha) ? "synced" : "draft"
            } 
        }
    );

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error renaming post:", error);
    return NextResponse.json(
      { error: "Failed to rename post" },
      { status: 500 }
    );
  }
}
