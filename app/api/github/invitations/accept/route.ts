import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { acceptRepoInvitation } from "@/lib/octokit";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || !session.access_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invitationId } = await req.json();

    if (!invitationId) {
      return NextResponse.json(
        { error: "Missing invitationId" },
        { status: 400 }
      );
    }

    await acceptRepoInvitation(
      session.access_token as string,
      parseInt(invitationId)
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error accepting GitHub invitation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept invitation" },
      { status: 500 }
    );
  }
}
