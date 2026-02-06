
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getS3Client } from "@/lib/s3";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const repoId = searchParams.get("repoId");

    const { isLimited } = await getS3Client(session.user.id, repoId || undefined);

    return NextResponse.json({ isLimited });

  } catch (error: any) {
    // If it fails to even get the client (unlikely now with fallback), assume limited or error
    return NextResponse.json({ isLimited: true, error: error.message });
  }
}
