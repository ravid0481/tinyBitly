
import { NextResponse } from "next/server";
import { listLinks, createLink } from "@/lib/links";

export const dynamic = "force-dynamic";

export async function GET() {
  const links = await listLinks();
  return NextResponse.json(links);
}

export async function POST(req) {
  try {
    const { url, customCode } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const link = await createLink(url, customCode || null);
    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    if (err.code === "INVALID_CODE") {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      );
    }
    if (err.code === "CODE_EXISTS") {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }

    console.error("Error creating link:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
