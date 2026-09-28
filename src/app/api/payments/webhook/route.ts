import { NextResponse } from "next/server";
import { verifyAndProcessWebhook } from "@/lib/packages";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryHmac = searchParams.get("hmac");
    const headerHmac = request.headers.get("x-callback-signature") || "";
    const hmac = queryHmac || headerHmac;

    const payload = await request.json();

    const result = await verifyAndProcessWebhook(payload, hmac);

    if (!result.verified) {
      return NextResponse.json({ error: "Invalid payment webhook signature" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      eventId: result.eventId,
      packageCode: result.packageCode,
    });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}

/**
 * Handles Paymob Transaction Response Callback via browser redirect (GET)
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const hmac = url.searchParams.get("hmac") || "";
    const success = url.searchParams.get("success") === "true";

    // Convert query parameters into payload object for HMAC verification
    const payload: Record<string, unknown> = {};
    url.searchParams.forEach((val, key) => {
      if (key !== "hmac") payload[key] = val;
    });

    const result = await verifyAndProcessWebhook(payload, hmac);

    if (result.verified && success && result.eventId) {
      return NextResponse.redirect(`${hostUrl}/dashboard/events/${result.eventId}?payment=success`);
    }

    if (result.eventId) {
      return NextResponse.redirect(`${hostUrl}/dashboard/events/${result.eventId}?payment=failed`);
    }

    return NextResponse.redirect(`${hostUrl}/dashboard?payment=complete`);
  } catch (error) {
    console.error("Payment GET callback error:", error);
    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${hostUrl}/dashboard`);
  }
}
