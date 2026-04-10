import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { updateFile } from "@/lib/octokit";
import matter from "gray-matter";

export interface GuestProfile {
  slug: string;
  name: string;
  role?: string;
  description?: string;
  image?: string;
  social?: Record<string, string>;
}

/**
 * GET /api/repo/guests?repo=owner/repo&branch=main
 *
 * Lists all guest profiles found in content/guests/ of the target repository.
 * Tries both "src/content/guests" and "content/guests" paths.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !session.access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo"); // owner/repo
  const branch = searchParams.get("branch") || undefined;

  if (!repo) {
    return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
  }

  const [owner, repoName] = repo.split("/");
  if (!owner || !repoName) {
    return NextResponse.json({ error: "Invalid repo format" }, { status: 400 });
  }

  const octokit = new Octokit({ auth: session.access_token });

  // Candidate paths where guests could live
  const candidatePaths = [
    "content/guests",
    "src/content/guests",
  ];

  const guests: GuestProfile[] = [];

  for (const guestsPath of candidatePaths) {
    try {
      const params: any = { owner, repo: repoName, path: guestsPath };
      if (branch) params.ref = branch;

      const { data: dirData } = await octokit.repos.getContent(params);

      if (!Array.isArray(dirData)) continue;

      const mdFiles = dirData.filter(
        (f) => f.type === "file" && (f.name.endsWith(".md") || f.name.endsWith(".mdx"))
      );

      // Fetch each file in parallel
      const fileContents = await Promise.all(
        mdFiles.map(async (file) => {
          try {
            const fileParams: any = { owner, repo: repoName, path: file.path };
            if (branch) fileParams.ref = branch;

            const { data: fileData } = await octokit.repos.getContent(fileParams);

            if ("content" in fileData) {
              const raw = Buffer.from(fileData.content, "base64").toString("utf-8");
              const { data: frontmatter } = matter(raw);

              const slug = file.name.replace(/\.mdx?$/, "");

              return {
                slug,
                name: frontmatter.name || slug,
                role: frontmatter.role,
                description: frontmatter.description,
                image: frontmatter.image,
                social:
                  typeof frontmatter.social === "string"
                    ? (() => {
                        try {
                          return JSON.parse(frontmatter.social);
                        } catch {
                          return undefined;
                        }
                      })()
                    : frontmatter.social,
              } as GuestProfile;
            }
          } catch {
            // Skip files that fail
          }
          return null;
        })
      );

      const valid = fileContents.filter(Boolean) as GuestProfile[];
      guests.push(...valid);

      // Found at least one valid path — stop searching
      if (valid.length > 0) break;
    } catch {
      // Path doesn't exist, try next candidate
    }
  }

  return NextResponse.json({ guests });
}

/**
 * POST /api/repo/guests
 *
 * Creates a new guest profile .md file in content/guests/{slug}.md
 * Body: { repo, name, role?, description?, image?, social?, branch? }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !session.access_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { repo, name, role, description, image, social, branch } = body;

  if (!repo || !name?.trim()) {
    return NextResponse.json({ error: "Missing required fields: repo, name" }, { status: 400 });
  }

  const [owner, repoName] = repo.split("/");
  if (!owner || !repoName) {
    return NextResponse.json({ error: "Invalid repo format" }, { status: 400 });
  }

  // Build a URL-friendly slug from the name
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Build frontmatter object — only include defined fields
  const frontmatter: Record<string, any> = { name: name.trim() };
  if (role?.trim()) frontmatter.role = role.trim();
  if (description?.trim()) frontmatter.description = description.trim();
  if (image?.trim()) frontmatter.image = image.trim();
  if (social && Object.keys(social).length > 0) {
    frontmatter.social = JSON.stringify(social);
  }

  // Serialize to markdown (frontmatter only, no body content)
  const markdownContent = matter.stringify("", frontmatter);

  // Determine the guests folder — try to detect which path exists
  const octokit = new Octokit({ auth: session.access_token });
  let guestsFolder = "content/guests";

  for (const candidate of ["content/guests", "src/content/guests"]) {
    try {
      await octokit.repos.getContent({
        owner,
        repo: repoName,
        path: candidate,
        ...(branch ? { ref: branch } : {}),
      });
      guestsFolder = candidate;
      break;
    } catch {
      // Not found, try next
    }
  }

  const filePath = `${guestsFolder}/${slug}.md`;

  try {
    const result = await updateFile(
      session.access_token as string,
      owner,
      repoName,
      filePath,
      markdownContent,
      `feat: add guest profile ${name}`,
      undefined, // new file — no sha
      { authorStrategy: "bot" }
    );

    return NextResponse.json({
      success: true,
      slug,
      filePath,
      sha: result.sha,
      commitSha: result.commit,
    });
  } catch (error: any) {
    console.error("Error creating guest:", error);
    if (error.status === 422) {
      return NextResponse.json(
        { error: "A guest file with that name already exists." },
        { status: 409 }
      );
    }
    if (error.status === 403) {
      return NextResponse.json(
        { error: "Permission denied on GitHub." },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 });
  }
}
