// app/api/_lib/cors.ts
import { NextResponse } from "next/server";

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
// e.g. "https://your-webflow-site.com"

export function corsResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
