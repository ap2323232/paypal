import { NextResponse } from "next/server";
import { corsResponse } from "../../_lib/cors";
import { getAccessToken, PP_BASE, findLink } from "../../_lib/paypal";

type CreateOrderBody = {
  amount: number | string; // "49.00" or 49
  currency?: string; // default "USD" (or "INR" if eligible on your acct)
  donor?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    isAnonymous?: boolean;
  };
  meta?: Record<string, any>; // optional
};
export async function OPTIONS() {
  // Preflight response for browsers
  return corsResponse({}, 200);
}
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateOrderBody;
    const value = Number(body.amount);
    const currency = (body.currency || "USD").toUpperCase();

    if (!value || value <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const access = await getAccessToken();

    // you can pass donor info in description / custom_id if you want
    const purchase_units = [
      {
        amount: { currency_code: currency, value: value.toFixed(2) },
        description: body?.donor?.isAnonymous
          ? "Anonymous donation"
          : `Donation from ${body?.donor?.firstName ?? ""} ${
              body?.donor?.lastName ?? ""
            }`.trim(),
        custom_id: body?.meta
          ? JSON.stringify(body.meta).slice(0, 127)
          : undefined, // <= 127 chars
      },
    ];

    const payload = {
      intent: "CAPTURE",
      purchase_units,
      application_context: {
        brand_name: "Your Org",
        user_action: "PAY_NOW",
        return_url: process.env.PAYPAL_RETURN_URL, // PayPal redirects here with ?token=ORDER_ID
        cancel_url: process.env.PAYPAL_CANCEL_URL, // PayPal redirects here on cancel
      },
    };

    const r = await fetch(`${PP_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json(
        { error: "create_order_failed", details: data },
        { status: 500 }
      );
    }

    const approveUrl = findLink(data.links, "approve");
    return NextResponse.json({ id: data.id, approveUrl, raw: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "unknown_error" },
      { status: 500 }
    );
  }
}
