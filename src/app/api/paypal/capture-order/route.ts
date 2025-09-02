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
    if (!id) {
      return corsResponse({ error: "orderID missing" }, 400);
    }

    const access = await getAccessToken();
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
      return corsResponse({ error: "capture_failed", details: data }, 500);
    }

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
