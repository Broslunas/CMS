
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Fetch all users projections
    const users = await db.collection("users").find({}, {
        projection: { email: 1, name: 1, image: 1, _id: 1 }
    }).toArray();

    return NextResponse.json({
        count: users.length,
        users: users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email, // Check if this is null or undefined
            image: u.image
        }))
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
