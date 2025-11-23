
import { notFound } from "next/navigation";
import { getLinkByCode } from "@/lib/links";

export const dynamic = "force-dynamic";

export default async function StatsPage({ params }) {
  const { code } = await params;

  if (!code) {
    notFound();
  }

  const link = await getLinkByCode(code);

  if (!link) {
    notFound();
  }

  const base =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const shortUrl = `${base}/${link.code}`;

  return (
    <div className="space-y-6 w-full max-w-2xl px-4">
      <a href="/" className="text-blue-600 underline text-sm">
        ← Back to Dashboard
      </a>

      <h1 className="text-xl font-semibold">Stats for {link.code}</h1>

      <div className="bg-white border rounded-xl shadow p-4 space-y-3 text-sm">
        <div>
          <div className="font-semibold">Short URL</div>
          <div className="font-mono break-all">{shortUrl}</div>
        </div>

        <div>
          <div className="font-semibold">Target URL</div>
          <a
            href={link.url}
            target="_blank"
            className="text-blue-600 underline break-all"
          >
            {link.url}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div>
            <div className="font-semibold">Total Clicks</div>
            <div>{link.total_clicks}</div>
          </div>

          <div>
            <div className="font-semibold">Last Clicked</div>
            <div>
              {link.last_clicked
                ? new Date(link.last_clicked).toLocaleString()
                : "Never"}
            </div>
          </div>

          <div>
            <div className="font-semibold">Created At</div>
            <div>
              {link.created_at
                ? new Date(link.created_at).toLocaleString()
                : "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
