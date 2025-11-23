import { notFound, redirect } from "next/navigation";
import { recordClickAndGetUrl } from "@/lib/links";

export const dynamic = "force-dynamic";

export default async function RedirectPage({ params }) {
  const { code } = await params;  

  if (!code) notFound();

  const url = await recordClickAndGetUrl(code);
  if (!url) notFound();

  redirect(url);
}
