import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [{ title: "Health — Aviix Media" }, { name: "robots", content: "noindex" }],
  }),
  component: HealthPage,
  ssr: false,
});

type Status = "checking" | "ok" | "error";

function HealthPage() {
  const [db, setDb] = useState<{ status: Status; latencyMs: number | null; error?: string }>({
    status: "checking",
    latencyMs: null,
  });

  useEffect(() => {
    const t0 = Date.now();
    supabase
      .from("site_content")
      .select("page", { head: true, count: "exact" })
      .limit(1)
      .then(({ error }) => {
        setDb({
          status: error ? "error" : "ok",
          latencyMs: Date.now() - t0,
          error: error?.message,
        });
      });
  }, []);

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const envOk = Boolean(url && key);

  const color = db.status === "ok" ? "#4ade80" : db.status === "error" ? "#de1b24" : "#a1a1aa";

  return (
    <pre
      style={{
        fontFamily: "monospace",
        fontSize: 13,
        padding: "2rem",
        color: "#e4e4e7",
        background: "#09090b",
        minHeight: "100vh",
        margin: 0,
      }}
    >
      {`status:    `}
      <span style={{ color }}>{db.status.toUpperCase()}</span>
      {`
timestamp: ${new Date().toISOString()}

[supabase]
  env:      ${envOk ? "✓ configured" : "✗ missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY"}
  db:       ${db.status === "checking" ? "…" : db.status === "ok" ? "✓ connected" : `✗ ${db.error ?? "unreachable"}`}
  latency:  ${db.latencyMs !== null ? `${db.latencyMs}ms` : "—"}
`}
    </pre>
  );
}
