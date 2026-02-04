
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { parseAstroConfig } from "@/lib/schema-parser";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !session.access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo"); // owner/repo
  const branch = searchParams.get("branch") || "master"; // fallback to master, ideally should be main or detect

  if (!repo) {
    return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
  }

  const [owner, repoName] = repo.split("/");

  if (!owner || !repoName) {
     return NextResponse.json({ error: "Invalid repo format" }, { status: 400 });
  }

  try {
    const octokit = new Octokit({ auth: session.access_token });
    
    // Try to get src/content/config.ts
    // We try 'main' first if branch not specified? Or just use the param.
    // Let's try to fetch metadata to get default branch if possible? 
    // For speed, just try the requested branch (default master).
    
    let content = "";
    try {
        const response = await octokit.repos.getContent({
            owner,
            repo: repoName,
            path: "src/content/config.ts",
            ref: branch,
        });

        if ('content' in response.data) {
             content = Buffer.from(response.data.content, "base64").toString("utf-8");
        }
    } catch (e: any) {
        // If 404 on master, try main if user didn't specify explicitly? 
        // For now, if it fails, maybe try 'main' if failure and branch was 'master' (default)
        if (e.status === 404 && branch === 'master') {
             try {
                const responseMain = await octokit.repos.getContent({
                    owner,
                    repo: repoName,
                    path: "src/content/config.ts",
                    ref: "main",
                });
                if ('content' in responseMain.data) {
                    content = Buffer.from(responseMain.data.content, "base64").toString("utf-8");
                }
             } catch (ex) {
                 // Still failed, return empty
             }
        }
    }

    if (!content) {
        return NextResponse.json({ schemas: {} });
    }

    const schemas = parseAstroConfig(content);
    return NextResponse.json({ schemas });

  } catch (error: any) {
    console.error("Error fetching config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
