// app/api/paypal/create-order/route.ts
import { getAccessToken, PP_BASE } from "../../_lib/paypal";
import { corsResponse } from "../../_lib/cors";

export async function OPTIONS() {
  return corsResponse({}, 200);
}

export async function POST(req: Request) {
  try {
    const { amount, currency = "USD", donor, meta } = await req.json();

    const value = Number(amount);
    if (!value || value <= 0) {
      return corsResponse({ error: "Invalid amount" }, 400);
    }

    const access = await getAccessToken();

    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency.toUpperCase(),
            value: value.toFixed(2),
          },
          description: donor?.isAnonymous
            ? "Anonymous donation"
            : `Donation from ${[donor?.firstName, donor?.lastName]
                .filter(Boolean)
                .join(" ")}`.trim(),
          custom_id: meta ? JSON.stringify(meta).slice(0, 127) : undefined,
        },
      ],
      application_context: {
        brand_name: "Donations",
        user_action: "PAY_NOW",
        return_url: process.env.PAYPAL_RETURN_URL,
        cancel_url: process.env.PAYPAL_CANCEL_URL,
      },
    };

    const r = await fetch(`${PP_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await r.json();
    if (!r.ok) {
      // Surface PayPal’s error clearly to your browser console
      return corsResponse(
        {
          error: "create_order_failed",
          status: r.status,
          name: data?.name,
          message: data?.message,
          details: data?.details,
        },
        500
      );
    }

    const approveUrl = Array.isArray(data.links)
      ? data.links.find((l: any) => l.rel === "approve")?.href
      : undefined;

    return corsResponse({ id: data.id, approveUrl });
  } catch (e: any) {
    return corsResponse({ error: e.message || "unknown_error" }, 500);
  }
}
