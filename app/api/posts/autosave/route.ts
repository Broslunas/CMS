import { auth } from "@/lib/auth";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, metadata, content } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userCollection = db.collection(getUserCollectionName(session.user.id));

    // Check if post exists
    const post = await userCollection.findOne({
      _id: new ObjectId(postId),
      type: "post",
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Update in MongoDB only (no GitHub commit)
    await userCollection.updateOne(
      { _id: new ObjectId(postId), type: "post" },
      {
        $set: {
          metadata,
          content,
          status: "modified",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error autosaving post:", error);
    return NextResponse.json(
      { error: "Failed to autosave post" },
      { status: 500 }
    );
  }
}
