"use server";

import { auth } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
