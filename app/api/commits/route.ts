import { auth } from "@/lib/auth";
import { listFileCommits } from "@/lib/octokit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const path = searchParams.get("path");

    if (!owner || !repo || !path) {
      return NextResponse.json(
        { error: "Missing required parameters (owner, repo, path)" },
        { status: 400 }
      );
    }

    const accessToken = session.access_token as string;
    const commits = await listFileCommits(accessToken, owner, repo, path);

    return NextResponse.json(commits);
  } catch (error) {
    console.error("Error fetching commits:", error);
    return NextResponse.json(
      { error: "Failed to fetch commits" },
      { status: 500 }
    );
  }
}
