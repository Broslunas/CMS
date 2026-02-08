import { auth } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, repoId, collection, content, metadata } = await req.json();

    if (!repoId) {
      return NextResponse.json({ error: "Missing repoId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Generate a unique token
    const token = crypto.randomUUID();
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    await db.collection("previews").insertOne({
      token,
      userId: session.user.id,
      postId: postId ? new ObjectId(postId) : null,
      repoId,
      collection: collection || "blog",
      content,
      metadata,
      createdAt: new Date(),
      expiresAt,
    });

    return NextResponse.json({ token, expiresAt });
  } catch (error) {
    console.error("Error generating preview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
