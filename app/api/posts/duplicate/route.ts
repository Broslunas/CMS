import { auth } from "@/lib/auth";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";
import { serializeMarkdown } from "@/lib/markdown";
import { updateFile } from "@/lib/octokit";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Missing postId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userCollection = db.collection(getUserCollectionName(session.user.id));
    
    // Find the original post
    // We need to find it regardless of whether it's ours or shared (we can duplicate shared posts into our own space? Or same space?)
    // For now, assume we duplicate into the SAME space where we found it.
    
    // First try our collection
    let originalPost = await userCollection.findOne({ _id: new ObjectId(postId) });
    let targetCollection = userCollection;
    let effectiveUserId = session.user.id;

    // If not found, check if it's in a shared project we have access to
    // But we don't know the repoId yet easily without iterating over all shared refs?
    // Actually, we usually pass repoId in context. Let's assume we search in the user's view first.
    
    if (!originalPost) {
        // It might be in another collection that we have access to.
        // But finding it by ID alone is tricky if we don't know the owner.
        // Let's assume the user has access.
        // We can look up all shared refs for this user.
        const sharedRefs = await userCollection.find({ type: "shared_project_reference" }).toArray();
        
        for (const ref of sharedRefs) {
            const ownerCollection = db.collection(getUserCollectionName(ref.ownerId));
            const p = await ownerCollection.findOne({ _id: new ObjectId(postId) });
            if (p) {
                originalPost = p;
                targetCollection = ownerCollection;
                effectiveUserId = ref.ownerId; // We are creating as 'effective' owner? Or just adding to that collection?
                // If we have 'manage' or 'create' permission.
                const permissions = ref.permissions || [];
                if (!permissions.includes("manage") && !permissions.includes("create")) {
                     return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
                }
                break;
            }
        }
    }

    if (!originalPost) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Prepare new post data
    const newMetadata = { ...originalPost.metadata };
    newMetadata.title = `${newMetadata.title || 'Untitled'} (Copy)`;
    
    // Generate new file path
    const extension = originalPost.filePath.split('.').pop() || 'md';
    const nameWithoutExt = originalPost.filePath.replace(`.${extension}`, '');
    // Append timestamp to avoid collision
    const newFilePath = `${nameWithoutExt}_copy_${Date.now()}.${extension}`;

    const newPost: any = {
      ...originalPost,
      _id: new ObjectId(), // New ID
      filePath: newFilePath,
      metadata: newMetadata,
      status: "draft", // Always start as draft
      sha: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastCommitAt: null
    };

    // Insert into DB
    const result = await targetCollection.insertOne(newPost);

    return NextResponse.json({
      success: true,
      postId: result.insertedId.toString(),
      repoId: originalPost.repoId
    });

  } catch (error: any) {
    console.error("Error duplicating post:", error);
    return NextResponse.json(
      { error: "Failed to duplicate post" },
      { status: 500 }
    );
  }
}
