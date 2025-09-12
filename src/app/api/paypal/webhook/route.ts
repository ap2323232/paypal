// app/api/paypal/webhook/route.ts
import { corsResponse } from "../../_lib/cors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("PayPal webhook received:", {
      eventType: body.event_type,
      resourceType: body.resource_type,
      summary: body.summary,
      id: body.id,
    });

    // Handle different PayPal webhook events
    switch (body.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        console.log("Payment captured successfully:", {
          captureId: body.resource?.id,
          amount: body.resource?.amount,
          status: body.resource?.status,
        });
        // Here you can update your database, send confirmation emails, etc.
        break;

      case "PAYMENT.CAPTURE.DENIED":
        console.log("Payment capture denied:", {
          captureId: body.resource?.id,
          reason: body.resource?.reason_code,
        });
        break;

      case "CHECKOUT.ORDER.APPROVED":
        console.log("Order approved by user:", {
          orderId: body.resource?.id,
          status: body.resource?.status,
        });
        break;

      case "CHECKOUT.ORDER.COMPLETED":
        console.log("Order completed:", {
          orderId: body.resource?.id,
          status: body.resource?.status,
        });
        break;

      default:
        console.log("Unhandled webhook event:", body.event_type);
    }

    return corsResponse({ received: true }, 200);
  } catch (e: any) {
    console.error("Webhook processing error:", e);
    return corsResponse({ error: e.message || "webhook_error" }, 500);
  }
}

export async function OPTIONS() {
  return corsResponse({}, 200);
}
