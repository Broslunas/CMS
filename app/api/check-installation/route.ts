import { auth } from "@/lib/auth";
import { checkAppInstalled } from "@/lib/github-app";
import { NextResponse } from "next/server";

/**
 * Endpoint to verify if the user has the GitHub App installed
 * GET /api/check-installation
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.access_token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isInstalled = await checkAppInstalled(session.access_token);

    return NextResponse.json({
      installed: isInstalled,
      message: isInstalled 
        ? "GitHub App installed correctly" 
        : "GitHub App not installed"
    });
  } catch (error) {
    console.error("Error checking installation:", error);
    return NextResponse.json(
      { error: "Error verifying installation" },
      { status: 500 }
    );
  }
}
