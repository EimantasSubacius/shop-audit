"use client";

import type { AuditReport } from "@/lib/types";
import { useState } from "react";

function statusColor(status: string): string {
  if (status === "pass") return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (status === "warn") return "text-amber-800 bg-amber-50 border-amber-200";
  return "text-rose-700 bg-rose-50 border-rose-200";
}

function scoreTone(percent: number): string {
  if (percent >= 80) return "text-emerald-700";
  if (percent >= 50) return "text-amber-700";
  return "text-rose-700";
}

export function AuditForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setReport(null);
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Audit failed.");
        return;
      }
      setReport(data as AuditReport);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-shop.com"
          className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          disabled={loading}
          autoComplete="url"
          inputMode="url"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Scanning…" : "Run audit"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-6 text-sm text-stone-600">
          Fetching homepage and running checks…
        </p>
      )}

      {report && (
        <div className="mt-10 space-y-8">
          <div className="rounded-2xl border border-stone-200 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-stone-500">
                  Score
                </p>
                <p className={`text-5xl font-semibold tabular-nums ${scoreTone(report.percent)}`}>
                  {report.percent}
                  <span className="text-2xl text-stone-400">/100</span>
                </p>
              </div>
              <div className="text-right text-sm text-stone-600">
                <p className="break-all">{report.finalUrl}</p>
                <p className="mt-1">{report.durationMs}ms · {report.checks.length} checks</p>
              </div>
            </div>
            {!report.fetchOk && report.fetchError && (
              <p className="mt-4 text-sm text-rose-700">{report.fetchError}</p>
            )}
          </div>

          {report.topFixes.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-stone-900">
                Top fixes
              </h2>
              <ol className="space-y-2">
                {report.topFixes.map((fix, i) => (
                  <li
                    key={fix.id}
                    className="rounded-xl border border-stone-200 bg-white px-4 py-3"
                  >
                    <span className="mr-2 text-stone-400">{i + 1}.</span>
                    <span className="font-medium text-stone-900">{fix.title}</span>
                    <p className="mt-1 text-sm text-stone-600">{fix.message}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-lg font-semibold text-stone-900">
              Checklist
            </h2>
            <ul className="space-y-2">
              {report.checks.map((check) => (
                <li
                  key={check.id}
                  className={`rounded-xl border px-4 py-3 ${statusColor(check.status)}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium">{check.title}</span>
                    <span className="text-xs uppercase tracking-wide">
                      {check.status} · {check.score}/{check.weight}
                    </span>
                  </div>
                  <p className="mt-1 text-sm opacity-90">{check.message}</p>
                  {check.evidence && (
                    <p className="mt-1 break-all text-xs opacity-70">
                      {check.evidence}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
