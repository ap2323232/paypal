// app/api/_lib/paypal.ts
export const PP_BASE = process.env.PP_BASE!;
const id = process.env.PP_CLIENT_ID!;
const secret = process.env.PP_SECRET!;

export async function getAccessToken() {
  const res = await fetch(`${PP_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export function findLink(links: any[], rel: string) {
  return Array.isArray(links)
    ? links.find((l) => l.rel === rel)?.href
    : undefined;
}
