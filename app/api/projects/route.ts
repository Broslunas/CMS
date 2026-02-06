import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userCollection = db.collection(getUserCollectionName(session.user.id));

    // 1. Fetch own projects
    const ownProjects = await userCollection
      .find({ type: "project" })
      .toArray();

    // 2. Fetch shared references
    const sharedRefs = await userCollection
      .find({ type: "shared_project_reference" })
      .toArray();

    // 3. Resolve shared projects
    const sharedProjectsPromises = sharedRefs.map(async (ref) => {
      try {
        const ownerCollection = db.collection(getUserCollectionName(ref.ownerId));
        const project = await ownerCollection.findOne({ 
          type: "project", 
          repoId: ref.repoId 
        });
        
        if (project) {
          return {
            ...project,
            _id: ref._id, 
            isShared: true,
            sharedBy: ref.ownerId
          };
        }
        return null; // Project not found or deleted by owner
      } catch (error) {
        return null;
      }
    });

    const sharedProjects = (await Promise.all(sharedProjectsPromises)).filter(p => p !== null);

    const allProjects = [...ownProjects, ...sharedProjects].sort((a: any, b: any) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    const simpleProjects = allProjects.map((project: any) => ({
      repoId: project.repoId,
      name: project.name,
      isShared: !!project.isShared
    }));

    return NextResponse.json(simpleProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
