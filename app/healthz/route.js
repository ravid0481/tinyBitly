
import { NextResponse } from "next/server";

const startedAt = Date.now();

export async function GET() {
  const uptimeMs = Date.now() - startedAt;

  return NextResponse.json({
    ok: true,
    version: "1.0",
    uptime_ms: uptimeMs,
  });
}
