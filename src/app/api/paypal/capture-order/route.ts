import { NextResponse } from "next/server";
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
    if (!id)
      return NextResponse.json({ error: "orderID missing" }, { status: 400 });

    const access = await getAccessToken();
    const r = await fetch(`${PP_BASE}/v2/checkout/orders/${id}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json(
        { error: "capture_failed", details: data },
        { status: 500 }
      );
    }

    // Typical success: data.status === 'COMPLETED'
    return NextResponse.json({
      ok: true,
      orderID: id,
      status: data.status,
      receipt: data,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "unknown_error" },
      { status: 500 }
    );
  }
}
