
import { NextResponse } from "next/server";
import { deleteLink } from "@/lib/links";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  const { code } = await params;

  if (!code) {
    return NextResponse.json(
      { error: "Code is required" },
      { status: 400 }
    );
  }

  await deleteLink(code);

  return NextResponse.json({ success: true });
}
