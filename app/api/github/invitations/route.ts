import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { listUserRepoInvitations } from "@/lib/octokit";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || !session.access_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitations = await listUserRepoInvitations(session.access_token as string);
    
    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Error fetching GitHub invitations:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}
