import { auth } from "@/lib/auth";
import { parseMarkdown } from "@/lib/markdown";
import clientPromise, { DB_NAME, getUserCollectionName } from "@/lib/mongodb";
import { getFileContent, updateFile } from "@/lib/octokit";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { owner, repo, path, sha, postId } = await request.json();

    if (!owner || !repo || !path || !sha || !postId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const accessToken = session.access_token as string;

    // 1. Obtener el contenido de la versión histórica (target commit)
    const targetFile = await getFileContent(accessToken, owner, repo, path, sha);

    if (!targetFile) {
      return NextResponse.json(
        { error: "Could not fetch target commit content" },
        { status: 404 }
      );
    }

    const rawContent = targetFile.content;
    const { metadata, content } = parseMarkdown(rawContent);

    // 2. Obtener el SHA actual del archivo (HEAD) para poder actualizarlo
    const currentFile = await getFileContent(accessToken, owner, repo, path);
    // Si no existe el archivo actual, es raro pero podría pasar (fue borrado).
    // Si fue borrado, updateFile sin sha lo crea.
    const currentSha = currentFile?.sha;

    // 3. Restaurar en GitHub (Crear nuevo commit con contenido antiguo)
    const updateResult = await updateFile(
      accessToken,
      owner,
      repo,
      path,
      rawContent,
      `Revert to version ${sha.substring(0, 7)}`,
      currentSha
    );

    // 4. Actualizar MongoDB
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const userCollection = db.collection(getUserCollectionName(session.user.id));

    await userCollection.updateOne(
      { _id: new ObjectId(postId), type: "post" },
      {
        $set: {
          metadata,
          content,
          sha: updateResult.sha,
          lastCommitAt: new Date(),
          status: "synced",
        },
      }
    );

    return NextResponse.json({
      success: true,
      newSha: updateResult.sha,
      commitSha: updateResult.commit,
      metadata,
      content,
    });
  } catch (error) {
    console.error("Error restoring version:", error);
    return NextResponse.json(
      { error: "Failed to restore version" },
      { status: 500 }
    );
  }
}
