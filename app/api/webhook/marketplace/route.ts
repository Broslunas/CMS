
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // We use a specific secret for the marketplace webhook
    const secret = process.env.MARKETPLACE_WEBHOOK_SECRET;
    
    // If no secret is configured, we can't verify, but we might want to allow it for testing 
    // if the user hasn't set it up yet. However, for security, it is best to require it.
    // Given the user is setting it up, we'll log a warning if missing.
    if (!secret) {
      console.warn("MARKETPLACE_WEBHOOK_SECRET is not defined in env. Skiping signature verification (UNSAFE).");
    }

    const body = await req.text();

    // Verify Signature if secret is present
    if (secret) {
        const signature = req.headers.get("x-hub-signature-256");
        if (!signature) {
             return NextResponse.json({ error: "Missing signature header" }, { status: 401 });
        }
        
        const hmac = crypto.createHmac("sha256", secret);
        const digest = "sha256=" + hmac.update(body).digest("hex");

        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
             return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
    }

    // Parse the payload
    // Note: If content-type is x-www-form-urlencoded, the body might need different parsing 
    // but typically webhooks send JSON if configured as application/json. 
    // The screenshot defaults to form-urlencoded but lets you choose. 
    // Users usually switch to JSON. If they stick to form-urlencoded, the body is a query string `payload={...}`.
    // GitHub sends `payload=...` for form-urlencoded.
    
    let payload;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
        const query = new URLSearchParams(body);
        const payloadString = query.get("payload");
        if (payloadString) {
            payload = JSON.parse(payloadString);
        } else {
             // Fallback or generic form data
             payload = Object.fromEntries(query.entries());
        }
    } else {
        // Assume JSON
        try {
            payload = JSON.parse(body);
        } catch (e) {
            console.error("Failed to parse JSON body");
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }
    }

    // Log the event for now
    // GitHub Marketplace events usually have an `action` and `marketplace_purchase` object
    const eventType = req.headers.get("x-github-event") || "unknown";
    console.log(`[Marketplace Webhook] Received event: ${eventType}`);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    // Valid response
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Marketplace webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
