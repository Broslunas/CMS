"use server";

import { auth } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

export async function getYouTubeVideos(pageToken?: string): Promise<{ videos?: YouTubeVideo[], nextPageToken?: string, error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "User not authenticated" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Find the Google account linked to the user
    // Note: NextAuth v5 (and v4) stores accounts in the 'accounts' collection
    // The userId is an ObjectId in the accounts collection if using MongoDB adapter properly configured, 
    // or string depending on setup. The auth.ts suggests userId is ObjectId in users collection.
    // Let's try both string and ObjectId just in case, or inspect the schema. 
    // Usually with MongoDBAdapter, userId in accounts is an ObjectId.
    
    let account = await db.collection("accounts").findOne({
      userId: new ObjectId(session.user.id),
      provider: "google"
    });

    if (!account) {
        // Fallback: try string ID if ObjectId didn't work (historical reasons or different adapter versions)
        account = await db.collection("accounts").findOne({
            userId: session.user.id,
            provider: "google"
        });
    }

    if (!account) {
      return { error: "No YouTube account connected. Please connect your YouTube account first." };
    }

    let accessToken = account.access_token;
    
    // Check for expiration (expires_at is usually in seconds/epoch or millseconds depending on provider, 
    // NextAuth standardizes to seconds? Google sends seconds.
    // It seems NextAuth stores expires_at as a number (seconds since epoch).
    // Let's verify if we need to refresh.
    // If expires_at is missing or close to expiration (within 5 mins), refresh.
    
    const nowSeconds = Math.floor(Date.now() / 1000);
    const expiresAt = account.expires_at as number;
    
    if (!accessToken || (expiresAt && nowSeconds >= expiresAt - 300)) {
        console.log("Refreshing YouTube access token...");
        const newTokens = await refreshGoogleToken(account.refresh_token);
        
        if (!newTokens) {
            return { error: "Failed to refresh YouTube session. Please reconnect your account." };
        }
        
        accessToken = newTokens.access_token;
        
        // Update DB
        await db.collection("accounts").updateOne(
            { _id: account._id },
            { 
                $set: {
                    access_token: newTokens.access_token,
                    expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                    // Only update refresh_token if a new one was returned
                    ...(newTokens.refresh_token ? { refresh_token: newTokens.refresh_token } : {})
                }
            }
        );
    }

    // Fetch Videos
    // We use search endpoint with forMine=true to get uploads from the authenticated user's channel
    // type=video ensures we get videos.
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&type=video&maxResults=20&order=date`;
    if (pageToken) {
        url += `&pageToken=${pageToken}`;
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("YouTube API Error:", errorData);
        // If 401 or 403, might need re-auth
        if (response.status === 401) {
             return { error: "YouTube session expired. Please reconnect." };
        }
        return { error: `YouTube API Error: ${errorData.error?.message || response.statusText}` };
    }

    const data = await response.json();
    
    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle
    }));

    return {
        videos,
        nextPageToken: data.nextPageToken
    };

  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return { error: "Internal Server Error" };
  }
}

export async function getYouTubePlaylists(): Promise<{ playlists?: { id: string, title: string, thumbnail: string }[], error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "User not authenticated" };
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        
        let account = await db.collection("accounts").findOne({
            userId: new ObjectId(session.user.id),
            provider: "google"
        });

        if (!account) {
            account = await db.collection("accounts").findOne({
                userId: session.user.id,
                provider: "google"
            });
        }

        if (!account) {
            return { error: "No YouTube account connected." };
        }

        let accessToken = account.access_token;
        const nowSeconds = Math.floor(Date.now() / 1000);
        const expiresAt = account.expires_at as number;
        
        if (!accessToken || (expiresAt && nowSeconds >= expiresAt - 300)) {
            const newTokens = await refreshGoogleToken(account.refresh_token);
            if (!newTokens) return { error: "Session expired." };
            accessToken = newTokens.access_token;
            await db.collection("accounts").updateOne(
                { _id: account._id },
                { 
                    $set: {
                        access_token: newTokens.access_token,
                        expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                        ...(newTokens.refresh_token ? { refresh_token: newTokens.refresh_token } : {})
                    }
                }
            );
        }

        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.error?.message || "Failed to fetch playlists" };
        }

        const data = await response.json();
        const playlists = data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.default?.url
        }));

        return { playlists };

    } catch (error) {
        console.error("Error fetching playlists:", error);
        return { error: "Internal Server Error" };
    }
}

export async function addVideoToPlaylist(videoId: string, playlistId: string): Promise<{ success: boolean, error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        
        let account = await db.collection("accounts").findOne({
            userId: new ObjectId(session.user.id),
            provider: "google"
        });

        if (!account) {
            account = await db.collection("accounts").findOne({
                userId: session.user.id,
                provider: "google"
            });
        }

        if (!account) return { success: false, error: "No account connected" };

        let accessToken = account.access_token;
        const nowSeconds = Math.floor(Date.now() / 1000);
        const expiresAt = account.expires_at as number;
        
        if (!accessToken || (expiresAt && nowSeconds >= expiresAt - 300)) {
            const newTokens = await refreshGoogleToken(account.refresh_token);
            if (!newTokens) return { success: false, error: "Session expired" };
            accessToken = newTokens.access_token;
            await db.collection("accounts").updateOne(
                { _id: account._id },
                { 
                    $set: {
                        access_token: newTokens.access_token,
                        expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                        ...(newTokens.refresh_token ? { refresh_token: newTokens.refresh_token } : {})
                    }
                }
            );
        }

        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: "youtube#video",
                        videoId: videoId
                    }
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.error?.message || "Failed to add to playlist" };
        }

        return { success: true };

    } catch (error) {
        console.error("Error adding to playlist:", error);
        return { success: false, error: "Internal error" };
    }
}

async function refreshGoogleToken(refreshToken: string) {
    if (!refreshToken) return null;
    
    try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: GOOGLE_CLIENT_ID!,
                client_secret: GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Failed to refresh Google token:", data);
            return null;
        }

        return data; // contains access_token, expires_in, scope, token_type, (sometimes refresh_token)
    } catch (error) {
        console.error("Error refreshing Google token:", error);
        return null;
    }
}

export async function createYouTubeUploadSession(metadata: {
    title: string;
    description: string;
    privacyStatus: "public" | "private" | "unlisted";
    publishAt?: string;
    tags?: string[];
    categoryId?: string;
    madeForKids?: boolean;
    embeddable?: boolean;
    license?: "youtube" | "creativeCommon";
    notifySubscribers?: boolean;
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "User not authenticated" };
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        let account = await db.collection("accounts").findOne({
            userId: new ObjectId(session.user.id),
            provider: "google"
        });

        if (!account) {
            account = await db.collection("accounts").findOne({
                userId: session.user.id,
                provider: "google"
            });
        }

        if (!account) {
            return { error: "No YouTube account connected. Please connect your YouTube account first." };
        }

        let accessToken = account.access_token;
        const nowSeconds = Math.floor(Date.now() / 1000);
        const expiresAt = account.expires_at as number;

        if (!accessToken || (expiresAt && nowSeconds >= expiresAt - 300)) {
            console.log("Refreshing YouTube access token...");
            const newTokens = await refreshGoogleToken(account.refresh_token);

            if (!newTokens) {
                return { error: "Failed to refresh YouTube session. Please reconnect your account." };
            }

            accessToken = newTokens.access_token;

            await db.collection("accounts").updateOne(
                { _id: account._id },
                {
                    $set: {
                        access_token: newTokens.access_token,
                        expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                        ...(newTokens.refresh_token ? { refresh_token: newTokens.refresh_token } : {})
                    }
                }
            );
        }

        const body: any = {
            snippet: {
                title: metadata.title,
                description: metadata.description,
                categoryId: metadata.categoryId || "22",
            },
            status: {
                privacyStatus: metadata.privacyStatus,
                selfDeclaredMadeForKids: metadata.madeForKids || false,
                embeddable: metadata.embeddable !== false,
                license: metadata.license || "youtube",
            }
        };

        if (metadata.tags && metadata.tags.length > 0) {
            body.snippet.tags = metadata.tags;
        }

        if (metadata.publishAt && metadata.privacyStatus === "private") {
            body.status.publishAt = metadata.publishAt; // ISO 8601 string
        }
        
        const notifyQuery = metadata.notifySubscribers === false ? "&notifySubscribers=false" : "&notifySubscribers=true";

        const headersList = await headers();
        const origin = headersList.get("origin") || (headersList.get("host") ? `http${headersList.get("host")?.includes('localhost') ? '' : 's'}://${headersList.get("host")}` : "http://localhost:3000");

        const response = await fetch(`https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status${notifyQuery}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Upload-Content-Type": "video/*",
                "Origin": origin,
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("YouTube Upload Init Error:", errorData);
            if (response.status === 401 || response.status === 403) {
                 return { error: "YouTube session expired or missing permissions. Please reconnect." };
            }
            return { error: `YouTube API Error: ${errorData.error?.message || response.statusText}` };
        }

        const uploadUrl = response.headers.get("Location");
        if (!uploadUrl) {
            return { error: "Failed to get resumable upload URL from YouTube" };
        }

        return { uploadUrl };

    } catch (error) {
        console.error("Error creating YouTube upload session:", error);
        return { error: "Internal Server Error" };
    }
}

export async function uploadYouTubeThumbnail(videoId: string, formData: FormData): Promise<{ success?: boolean; error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { error: "User not authenticated" };
        }

        const imageFile = formData.get("image") as File;
        if (!imageFile) return { error: "No image file provided" };

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        let account = await db.collection("accounts").findOne({
            userId: new ObjectId(session.user.id),
            provider: "google"
        });

        if (!account) {
            account = await db.collection("accounts").findOne({
                userId: session.user.id,
                provider: "google"
            });
        }

        if (!account || !account.access_token) {
            return { error: "No YouTube account connected." };
        }

        let accessToken = account.access_token;
        const nowSeconds = Math.floor(Date.now() / 1000);
        const expiresAt = account.expires_at as number;

        if (expiresAt && nowSeconds >= expiresAt - 300) {
            const newTokens = await refreshGoogleToken(account.refresh_token);
            if (newTokens) {
                accessToken = newTokens.access_token;
                await db.collection("accounts").updateOne(
                    { _id: account._id },
                    {
                        $set: {
                            access_token: newTokens.access_token,
                            expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                            ...(newTokens.refresh_token ? { refresh_token: newTokens.refresh_token } : {})
                        }
                    }
                );
            }
        }

        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const response = await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": imageFile.type || "image/jpeg",
            },
            body: buffer
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("YouTube Thumbnail Upload Error:", errorData);
            return { error: `Failed to upload thumbnail: ${errorData.error?.message || response.statusText}` };
        }

        return { success: true };
    } catch (error) {
        console.error("Error uploading YouTube thumbnail:", error);
        return { error: "Internal Server Error" };
    }
}

export async function checkYouTubeConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { connected: false, error: "User not authenticated" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let account = await db.collection("accounts").findOne({
      userId: new ObjectId(session.user.id),
      provider: "google"
    });

    if (!account) {
      account = await db.collection("accounts").findOne({
        userId: session.user.id,
        provider: "google"
      });
    }

    return { connected: !!account };
  } catch (error) {
    console.error("Error checking YouTube connection:", error);
    return { connected: false, error: "Internal Server Error" };
  }
}

export async function unlinkYouTubeAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result1 = await db.collection("accounts").deleteOne({
      userId: new ObjectId(session.user.id),
      provider: "google"
    });

    const result2 = await db.collection("accounts").deleteOne({
      userId: session.user.id,
      provider: "google"
    });

    if (result1.deletedCount > 0 || result2.deletedCount > 0) {
      return { success: true };
    } else {
      return { success: false, error: "No YouTube account found to unlink" };
    }
  } catch (error) {
    console.error("Error unlinking YouTube account:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

