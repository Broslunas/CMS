import { auth } from "@/lib/auth";
import { checkAppInstalled } from "@/lib/github-app";
import { NextResponse } from "next/server";

/**
 * Endpoint to verify if the user has the GitHub App installed
 * GET /api/check-installation
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.access_token || !session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { checkAppInstalled } = await import("@/lib/github-app");
    const isInstalled = await checkAppInstalled(session.access_token);

    if (isInstalled) {
      // Update user in database to reflect installation
      try {
        const { default: clientPromise, DB_NAME } = await import("@/lib/mongodb");
        const { ObjectId } = await import("mongodb");
        
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        
        await db.collection("users").updateOne(
          { _id: new ObjectId(session.user.id) },
          { 
            $set: { 
              appInstalled: true,
              lastAppCheck: new Date()
            } 
          }
        );
        console.log(`Updated user ${session.user.id} appInstalled status to true`);
      } catch (dbError) {
        console.error("Error updating user status in DB:", dbError);
        // Continue even if DB update fails, client will retry or session might catch it
      }
    }

    return NextResponse.json({
      installed: isInstalled,
      message: isInstalled 
        ? "GitHub App installed correctly" 
        : "GitHub App not installed"
    });
  } catch (error) {
    console.error("Error checking installation:", error);
    return NextResponse.json(
      { error: "Error verifying installation" },
      { status: 500 }
    );
  }
}
