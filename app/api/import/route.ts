import { auth } from "@/lib/auth";
import { listContentFiles, getFileContent } from "@/lib/octokit";
import { parseMarkdown } from "@/lib/markdown";
import { PostMetadataSchema } from "@/lib/schemas";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import {
  parseContentConfig,
  detectCollectionFromPath,
  validateAgainstSchema,
} from "@/lib/config-parser";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { owner, repo, name, description } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    const accessToken = session.access_token as string;
    const userId = session.user.id;
    const repoId = `${owner}/${repo}`;

    // 1. Parse the config.ts to get the schemas
    console.log("Parsing config.ts...");
    const schemas = await parseContentConfig(accessToken, owner, repo);
    console.log(`Found ${schemas.length} schemas:`, schemas.map(s => s.name));

    // 2. List content files
    const files = await listContentFiles(accessToken, owner, repo);

    if (files.length === 0) {
      return NextResponse.json({
        message: "No content files found",
        imported: 0,
      });
    }

    // 3. Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Determine target collection and userId
    let targetCollection = db.collection(getUserCollectionName(userId));
    let effectiveUserId = userId;

    // Check for shared reference
    const sharedRef = await targetCollection.findOne({ 
       type: "shared_project_reference", 
       repoId 
    });

    if (sharedRef) {
        targetCollection = db.collection(getUserCollectionName(sharedRef.ownerId));
        effectiveUserId = sharedRef.ownerId;
    }

    let imported = 0;
    const errors: string[] = [];

    // 4. Process all files in parallel for better performance
    const processResults = await Promise.all(
      files.map(async (filePath) => {
        try {
          const fileData = await getFileContent(accessToken, owner, repo, filePath);

          if (!fileData) {
            return { success: false, error: `Could not fetch ${filePath}` };
          }

          // 5. Parse the markdown
          const { metadata, content } = parseMarkdown(fileData.content);

          // 6. Detect which collection it belongs to
          const collectionName = detectCollectionFromPath(filePath);
          const schema = schemas.find((s) => s.name === collectionName) || schemas[0];

          // 7. Validate against the collection schema
          const validationResult = validateAgainstSchema(metadata, schema);

          if (!validationResult.valid) {
            return { 
              success: false, 
              error: `Invalid metadata in ${filePath}: ${validationResult.errors?.join(", ")}` 
            };
          }

          // 8. Prepare the document for MongoDB
          return {
            success: true,
            document: {
              type: "post",
              collection: collectionName,
              sha: fileData.sha,
              metadata: validationResult.data,
              content,
              status: "synced",
              lastCommitAt: new Date(),
              updatedAt: new Date(),
              userId: effectiveUserId,
              repoId,
              filePath,
              createdAt: new Date(),
            }
          };
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
          return { success: false, error: `Error processing ${filePath}` };
        }
      })
    );

    // Separate successful results from errors
    const successfulDocs = processResults.filter(r => r.success);
    const failedResults = processResults.filter(r => !r.success);
    
    // Add errors
    errors.push(...failedResults.map(r => r.error!));

    // 9. Save all documents in bulk (bulkWrite is more efficient)
    if (successfulDocs.length > 0) {
      const bulkOps = successfulDocs.map((result: any) => ({
        updateOne: {
          filter: { type: "post", userId: effectiveUserId, repoId, filePath: result.document.filePath },
          update: {
            $set: {
              type: result.document.type,
              collection: result.document.collection,
              sha: result.document.sha,
              metadata: result.document.metadata,
              content: result.document.content,
              status: result.document.status,
              lastCommitAt: result.document.lastCommitAt,
              updatedAt: result.document.updatedAt,
            },
            $setOnInsert: {
              userId: result.document.userId,
              repoId: result.document.repoId,
              filePath: result.document.filePath,
              createdAt: result.document.createdAt,
            },
          },
          upsert: true,
        },
      }));

      await targetCollection.bulkWrite(bulkOps);
      imported = successfulDocs.length;
    }

    // 10. Save collection schemas
    for (const schema of schemas) {
      await targetCollection.updateOne(
        { type: "schema", userId: effectiveUserId, repoId, collectionName: schema.name },
        {
          $set: {
            type: "schema",
            collectionName: schema.name,
            fields: schema.fields,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            userId: effectiveUserId,
            repoId,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    // 11. Save/update the project in user collection
    await targetCollection.updateOne(
      { type: "project", userId: effectiveUserId, repoId },
      {
        $set: {
          type: "project",
          name: name || repo,
          description: description || "",
          postsCount: imported,
          lastSync: new Date(),
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: effectiveUserId,
          repoId,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: `Import complete`,
      imported,
      total: files.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import content" },
      { status: 500 }
    );
  }
}
