
import { auth } from "@/lib/auth";
import { getFileContent } from "@/lib/octokit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const repoId = searchParams.get("repoId"); // "owner/repo"

  if (!repoId) {
    return NextResponse.json({ error: "Missing repoId" }, { status: 400 });
  }

  const [owner, repo] = repoId.split("/");

  if (!owner || !repo) {
    return NextResponse.json({ error: "Invalid repoId" }, { status: 400 });
  }

  try {
    const file = await getFileContent(
      session.access_token,
      owner,
      repo,
      "broslunas-cms.md"
    );

    if (!file) {
      return NextResponse.json({ error: "Manual not found" }, { status: 404 });
    }

    return NextResponse.json({ content: file.content });
  } catch (error) {
    console.error("Error fetching manual:", error);
    return NextResponse.json({ error: "Failed to fetch manual" }, { status: 500 });
  }
}
