import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";
import Parser from "rss-parser";

const parser = new Parser({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded'],
            ['itunes:summary', 'itunesSummary'],
            ['itunes:episode', 'itunesEpisode'],
            ['itunes:image', 'itunesImage'],
            ['enclosure', 'enclosure']
        ]
    }
});

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const repoId = searchParams.get("repoId");

        if (!repoId) {
            return NextResponse.json({ error: "Missing repoId" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userCollection = db.collection(getUserCollectionName(session.user.id));

        let project = await userCollection.findOne({ type: "project", repoId });

        if (!project) {
            const sharedRef = await userCollection.findOne({ type: "shared_project_reference", repoId });
            if (sharedRef) {
                const ownerCollection = db.collection(getUserCollectionName(sharedRef.ownerId));
                project = await ownerCollection.findOne({ type: "project", repoId });
            }
        }

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (!project.rssUrl) {
            return NextResponse.json({ error: "RSS URL not configured for this repo" }, { status: 400 });
        }

        const feed = await parser.parseURL(project.rssUrl);

        return NextResponse.json({ items: feed.items, title: feed.title });

    } catch (error: any) {
        console.error("RSS feed error:", error);
        return NextResponse.json({ error: error.message || "Error fetching RSS feed" }, { status: 500 });
    }
}
