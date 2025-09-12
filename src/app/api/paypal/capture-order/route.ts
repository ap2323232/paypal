// app/api/paypal/capture-order/route.ts
import { getAccessToken, PP_BASE } from "../../_lib/paypal";
import { corsResponse } from "../../_lib/cors";

export async function OPTIONS() {
  // Preflight response for browsers
  return corsResponse({}, 200);
}

export async function POST(req: Request) {
  try {
    const { orderID, token } = await req.json(); // PayPal returns ?token=ORDER_ID on return_url
    const id = orderID || token;

    console.log("Capturing PayPal order:", { orderID, token, id });

    if (!id) {
      console.error("No order ID provided for capture");
      return corsResponse({ error: "orderID missing" }, 400);
    }

    // Check environment variables
    if (
      !process.env.PP_BASE ||
      !process.env.PP_CLIENT_ID ||
      !process.env.PP_SECRET
    ) {
      console.error("Missing PayPal environment variables for capture");
      return corsResponse({ error: "PayPal configuration missing" }, 500);
    }

    const access = await getAccessToken();
    console.log("PayPal access token obtained for capture");
    const r = await fetch(`${PP_BASE}/v2/checkout/orders/${id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("PayPal capture failed:", {
        status: r.status,
        statusText: r.statusText,
        data: data,
      });
      return corsResponse({ error: "capture_failed", details: data }, 500);
    }

    console.log("PayPal capture successful:", {
      orderID: id,
      status: data.status,
      captureId: data?.purchase_units?.[0]?.payments?.captures?.[0]?.id,
    });

    // Typical success: data.status === 'COMPLETED'
    return corsResponse({
      ok: true,
      orderID: id,
      status: data.status,
      receipt: data,
      captureId: data?.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null,
    });
  } catch (e: any) {
    return corsResponse({ error: e.message || "unknown_error" }, 500);
  }
}
