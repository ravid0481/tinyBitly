"use client";

import { useState } from "react";

export default function DashboardClient({ initialLinks }) {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [links, setLinks] = useState(initialLinks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDeleteError("");

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customCode: customCode || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create link");
      }

      setLinks((prev) => [data, ...prev]);
      setUrl("");
      setCustomCode("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(code) {
    setDeleteError("");

    try {
      const res = await fetch(`/api/links/${code}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete");
      }

      setLinks((prev) => prev.filter((l) => l.code !== code));
    } catch (err) {
      setDeleteError(err.message || "Failed to delete");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        TinyLink – URL Shortener
      </h1>

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-2xl shadow p-4 space-y-4"
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium">URL</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Custom Code (optional)
          </label>
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="6–8 characters"
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500">
            Allowed: A–Z a–z 0–9 (length 6–8)
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium text-sm disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow p-4 space-y-3 text-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Your Links</h2>
          <span className="text-xs text-slate-500">
            Click a code to view detailed stats
          </span>
        </div>

        {links.length === 0 ? (
          <p className="text-sm text-slate-500">No links yet.</p>
        ) : (
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="py-1">Code</th>
                <th className="py-1">URL</th>
                <th className="py-1">Clicks</th>
                <th className="py-1">Last Clicked</th>
                <th className="py-1">Actions</th>
              </tr>
            </thead>

            <tbody>
              {links.map((link) => {
                const short = `http://localhost:3000/${link.code}`;
                return (
                  <tr key={link.code} className="border-b last:border-0">
                    <td className="py-1 align-top">
                      <a
                        href={`/code/${link.code}`}
                        className="text-blue-600 underline"
                      >
                        {link.code}
                      </a>
                      <div className="text-[10px] text-slate-500">
                        {short}
                      </div>
                    </td>

                    <td className="py-1 align-top max-w-xs break-all">
                      {link.url}
                    </td>

                    <td className="py-1 align-top">
                      {link.total_clicks ?? 0}
                    </td>

                    <td className="py-1 align-top">
                      {link.last_clicked
                        ? new Date(link.last_clicked).toLocaleString()
                        : "Never"}
                    </td>

                    <td className="py-1 align-top space-x-2">
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(short)
                        }
                        className="px-2 py-1 rounded-lg border text-xs"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() => handleDelete(link.code)}
                        className="px-2 py-1 rounded-lg border border-red-300 text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
