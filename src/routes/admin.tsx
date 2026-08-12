import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/primitives";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { PartnerLogos } from "@/components/PartnerLogos";
import { Showreel } from "@/components/Showreel";
import { ClipsCarousel } from "@/components/ClipsCarousel";
import { BottomCTA } from "@/components/BottomCTA";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import siteJson from "@/content/site.json";
import homeJson from "@/content/home.json";
import aboutJson from "@/content/about.json";
import contactJson from "@/content/contact.json";
import { cn } from "@/lib/utils";

const pageFallbacks: Record<string, any> = {
  site: siteJson,
  home: homeJson,
  about: aboutJson,
  contact: contactJson,
};
import {
  LogOut,
  Loader2,
  Trash2,
  Plus,
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  ImageIcon,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Aviix Media" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
  ssr: false,
});

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];
type AuthStatus = "loading" | "unauthenticated" | "not_admin" | "admin";

function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. Mount check prevents React #418 hydration mismatch during SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Single unified auth & role verification flow
  useEffect(() => {
    if (!mounted) return;

    let isSubscribed = true;

    const verifyAuth = async (currSession: Session | null) => {
      if (!isSubscribed) return;
      setSession(currSession);

      if (!currSession) {
        setAuthStatus("unauthenticated");
        return;
      }

      setAuthStatus("loading");

      try {
        // Query user_roles table for admin status
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", currSession.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleData && roleData.role === "admin") {
          if (isSubscribed) setAuthStatus("admin");
          return;
        }

        // Query admin count
        const { count } = await supabase
          .from("user_roles")
          .select("id", { count: "exact", head: true })
          .eq("role", "admin");

        if (isSubscribed) {
          const adminCount = count ?? 0;
          setHasAdmin(adminCount > 0);

          if (adminCount === 0) {
            setAuthStatus("not_admin"); // No admin exists yet
          } else {
            setAuthStatus("not_admin"); // Admin exists but user is not it
          }
        }
      } catch (err) {
        console.error("Error verifying admin credentials:", err);
        if (isSubscribed) setAuthStatus("unauthenticated");
      }
    };

    const sub = supabase.auth.onAuthStateChange((_event, s) => {
      verifyAuth(s);
    });

    supabase.auth.getSession().then(({ data }) => {
      verifyAuth(data.session);
    });

    return () => {
      isSubscribed = false;
      sub.data.subscription.unsubscribe();
    };
  }, [mounted, refreshKey]);

  if (!mounted || authStatus === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (authStatus === "unauthenticated" || !session) {
    return <AuthPanel hasAdmin={hasAdmin} onAuthSuccess={() => setRefreshKey((k) => k + 1)} />;
  }

  if (authStatus === "not_admin") {
    return (
      <ClaimAdminPanel
        onClaimed={() => setRefreshKey((k) => k + 1)}
        email={session.user.email ?? ""}
      />
    );
  }

  return <Dashboard email={session.user.email ?? ""} />;
}

/* ─── Auth ─────────────────────────────────────────────── */

function AuthPanel({
  hasAdmin,
  onAuthSuccess,
}: {
  hasAdmin: boolean | null;
  onAuthSuccess?: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "signup" && !hasAdmin) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setMsg(error ? error.message : "Check your email to confirm, then sign in.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMsg(error.message);
      } else if (data.session) {
        onAuthSuccess?.();
      }
    }
    setBusy(false);
  };

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-2xl">
        <h1 className="text-xl font-bold uppercase tracking-widest text-white">
          Admin {mode === "signup" && !hasAdmin ? "Sign up" : "Sign in"}
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Restricted area. Aviix Media staff only.
        </p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-3 pr-10 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              aria-label="Toggle password"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {msg && <p className="text-xs text-primary">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signup" && !hasAdmin ? "Create account" : "Sign in"}
          </button>
          {!hasAdmin && (
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setMsg(null);
              }}
              className="text-xs text-muted-foreground hover:text-white"
            >
              {mode === "signup"
                ? "Have an account? Sign in"
                : "Need to create the admin account? Sign up"}
            </button>
          )}
        </form>
      </div>
    </Container>
  );
}

function ClaimAdminPanel({ onClaimed, email }: { onClaimed: () => void; email: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const claim = async () => {
    setBusy(true);
    const { data, error } = await supabase.rpc("claim_admin");
    setBusy(false);
    if (error) setMsg(error.message);
    else if (data === false) setMsg("An admin already exists. This account has no admin access.");
    else onClaimed();
  };

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <h1 className="text-xl font-bold uppercase tracking-widest text-white">Not an admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <span className="text-white">{email}</span>. If this is the first setup, you
          can claim the admin role now.
        </p>
        {msg && <p className="mt-4 text-xs text-primary">{msg}</p>}
        <div className="mt-6 flex gap-3">
          <button
            onClick={claim}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Claim admin
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-background"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </Container>
  );
}

/* ─── Dashboard Shell ───────────────────────────────────── */

type Tab = "overview" | "home" | "about" | "contact" | "site" | "clips" | "messages" | "logs";

function Dashboard({ email }: { email: string }) {
  const [tab, setTabState] = useState<Tab>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_active_tab") as Tab;
      if (
        saved &&
        ["overview", "home", "about", "contact", "site", "clips", "messages", "logs"].includes(saved)
      ) {
        return saved;
      }
    }
    return "overview";
  });

  const setTab = (t: Tab) => {
    setTabState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_active_tab", t);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "home", label: "Home Page" },
    { id: "about", label: "About Page" },
    { id: "contact", label: "Contact Page" },
    { id: "clips", label: "Video Clips" },
    { id: "messages", label: "Messages" },
    { id: "site", label: "Global/Site" },
    { id: "logs", label: "System Logs" },
  ];

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">
            Admin Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">Signed in as {email}</p>
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-card"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-widest transition",
              tab === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-white",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "home" && <ContentEditor page="home" />}
        {tab === "about" && <ContentEditor page="about" />}
        {tab === "contact" && <ContentEditor page="contact" />}
        {tab === "site" && <ContentEditor page="site" />}
        {tab === "clips" && <ClipsManager />}
        {tab === "messages" && <MessagesTab />}
        {tab === "logs" && <LogsTab />}
      </div>
    </Container>
  );
}

/* ─── Overview ─────────────────────────────────────────── */

function OverviewTab() {
  const [stats, setStats] = useState<{
    clips: number;
    messages: number;
    unread: number;
    lastEdit: string | null;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ count: clipsCount }, { count: msgCount }, { count: unread }, lastEdit] =
        await Promise.all([
          supabase.from("clips").select("id", { count: "exact", head: true }),
          supabase.from("contact_messages").select("id", { count: "exact", head: true }),
          supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("read", false),
          supabase
            .from("site_content")
            .select("updated_at")
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);
      setStats({
        clips: clipsCount ?? 0,
        messages: msgCount ?? 0,
        unread: unread ?? 0,
        lastEdit: lastEdit.data?.updated_at ?? null,
      });
    })();
  }, []);

  const cards = [
    { label: "Clips", value: stats?.clips ?? "—" },
    { label: "Messages", value: stats?.messages ?? "—" },
    { label: "Unread", value: stats?.unread ?? "—" },
    {
      label: "Last edit",
      value: stats?.lastEdit ? new Date(stats.lastEdit).toLocaleString() : "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
          <div className="mt-2 text-2xl font-black text-white">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Generic Field Components ──────────────────────────── */

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(cls, "resize-y")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function FieldSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-white">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3 flex flex-col gap-3">{children}</div>
      )}
    </div>
  );
}

/* ─── Content Editor (Visual Form) ─────────────────────── */

function deepMerge(target: any, source: any): any {
  if (typeof target !== "object" || target === null) return source ?? target;
  if (typeof source !== "object" || source === null) return target;

  if (Array.isArray(target)) {
    if (!Array.isArray(source) || source.length === 0) return target;
    return source.map((item: any, i: number) => {
      const targetSample = target[i] ?? target[0];
      return deepMerge(targetSample, item);
    });
  }

  const result: any = { ...target, ...source };
  for (const k of Object.keys(target)) {
    if (k in source) {
      result[k] = deepMerge(target[k], source[k]);
    } else {
      result[k] = target[k];
    }
  }
  return result;
}

function ContentEditor({ page }: { page: "home" | "about" | "contact" | "site" }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: row } = await supabase
      .from("site_content")
      .select("data")
      .eq("page", page)
      .maybeSingle();
    // Deep merge template fallback JSON with DB data so all new logo and show fields exist
    const fallbackData = pageFallbacks[page] ?? {};
    setData(deepMerge(fallbackData, row?.data ?? {}));
    setLoading(false);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setBusy(true);
    await supabase.from("site_content").upsert({ page, data }, { onConflict: "page" });
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* ── Left: Form ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Edit: {page === "site" ? "Header & Footer (Site)" : page}
          </h2>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : saved ? (
              <Check className="h-3 w-3" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
        <DynamicForm data={data} onChange={setData} />
      </div>

      {/* ── Right: Live Visual Webpage Preview ── */}
      <LiveSitePreview page={page} data={data} />
    </div>
  );
}

/* ─── Live Site Visual Preview Component ──────────────────── */
function LiveSitePreview({ page }: { page: string }) {
  const routePath = page === "home" ? "/" : page === "site" ? "/" : `/${page}`;

  return (
    <div className="hidden xl:block">
      <div className="sticky top-4 flex flex-col gap-2">
        {/* Browser Mockup Window Container */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-[#0a0a0a] shadow-2xl flex flex-col items-center">
          {/* Top Browser Address Bar */}
          <div className="w-full flex items-center justify-between border-b border-border/60 bg-zinc-900 px-3 py-2 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-1.5 rounded bg-black/60 px-3 py-0.5 text-[9px] font-mono text-muted-foreground">
              <span>https://aviixmedia.com{routePath === "/" ? "" : routePath}</span>
            </div>
          </div>

          {/* Clean Preview CTA */}
          <div className="w-full flex flex-col items-center justify-center p-10 bg-[#050505] min-h-[300px] gap-4">
            <div className="h-12 w-12 rounded-full border border-border bg-card flex items-center justify-center text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Live Page Preview</h3>
              <p className="text-[11px] text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                Opens your live site in a new browser tab for a clean, full-resolution preview.
              </p>
            </div>
            <a
              href={routePath}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition shadow-lg"
            >
              Open Live Page ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    // Auto-cleanup logs older than 30 days
    await supabase.rpc('cleanup_site_errors');
    
    const { data } = await supabase
      .from("site_errors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-white">System Logs</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Recent crashes and hydration errors. Auto-cleaned after 30 days.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-xs font-semibold uppercase tracking-widest text-secondary-foreground hover:bg-secondary/80"
        >
          <RefreshCcw className={cn("h-3 w-3", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">No recent errors found.</div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div key={log.id} className="p-4 text-xs">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="font-mono text-red-400 break-all">{log.message}</div>
                  <div className="whitespace-nowrap text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
                {log.url && (
                  <div className="text-muted-foreground mb-1"><span className="text-primary/70 font-semibold uppercase text-[10px] tracking-wider">URL:</span> {log.url}</div>
                )}
                {log.user_agent && (
                  <div className="text-muted-foreground mb-2"><span className="text-primary/70 font-semibold uppercase text-[10px] tracking-wider">Agent:</span> {log.user_agent}</div>
                )}
                {log.stack_trace && (
                  <pre className="mt-2 p-3 bg-background rounded border border-border/50 text-[10px] text-muted-foreground overflow-x-auto">
                    {log.stack_trace}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Shared Components ────────────────────────────── */
// Recursively renders fields for any JSON shape

/* eslint-disable @typescript-eslint/no-explicit-any */
function DynamicForm({
  data,
  onChange,
  depth = 0,
}: {
  data: any;
  onChange: (v: any) => void;
  depth?: number;
}) {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <textarea
        rows={2}
        value={data}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-white focus:border-primary focus:outline-none resize-y"
      />
    );
  }
  if (typeof data === "number" || typeof data === "boolean") {
    return (
      <input
        type={typeof data === "number" ? "number" : "text"}
        value={String(data)}
        onChange={(e) =>
          onChange(typeof data === "number" ? Number(e.target.value) : e.target.value === "true")
        }
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
      />
    );
  }
  if (Array.isArray(data)) {
    return (
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border border-border/60 bg-zinc-900/60 p-3",
              depth > 0 && "bg-zinc-950/60",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Item {i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(data.filter((_: unknown, idx: number) => idx !== i))}
                className="text-muted-foreground hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <DynamicForm
              depth={depth + 1}
              data={item}
              onChange={(v) => onChange(data.map((x: unknown, idx: number) => (idx === i ? v : x)))}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const sample = data[0];
            const blank: any =
              typeof sample === "string"
                ? ""
                : typeof sample === "object" && sample !== null
                  ? Object.fromEntries(
                      Object.keys(sample).map((k) => [
                        k,
                        typeof sample[k] === "string"
                          ? ""
                          : typeof sample[k] === "number"
                            ? 0
                            : typeof sample[k] === "boolean"
                              ? false
                              : [],
                      ]),
                    )
                  : "";
            onChange([...data, blank]);
          }}
          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80"
        >
          <Plus className="h-3 w-3" /> Add item
        </button>
      </div>
    );
  }
  if (typeof data === "object") {
    return (
      <div className="flex flex-col gap-3">
        {Object.keys(data).map((key) => (
          <div key={key}>
            {typeof data[key] === "object" && data[key] !== null ? (
              <FieldSection title={key} defaultOpen={depth === 0}>
                <DynamicForm
                  depth={depth + 1}
                  data={data[key]}
                  onChange={(v) => onChange({ ...data, [key]: v })}
                />
              </FieldSection>
            ) : typeof data[key] === "boolean" ? (
              <div className="flex items-center justify-between rounded-md border border-border bg-background/50 px-3 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Show / Enable ({key})
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(data[key])}
                    onChange={(e) => onChange({ ...data, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ) : key === "image" ||
              key === "video" ||
              key === "logo" ||
              key === "src" ||
              key === "avatar" ||
              key === "icon" ||
              key === "photo" ||
              key.toLowerCase().includes("image") ||
              key.toLowerCase().includes("video") ||
              key.toLowerCase().includes("logo") ||
              key.toLowerCase().includes("icon") ||
              key.toLowerCase().includes("avatar") ||
              key.toLowerCase().includes("photo") ||
              key.toLowerCase().includes("src") ? (
              <MediaUploadField
                clipId={`cms_${key}_${depth}`}
                label={key}
                currentUrl={String(data[key] ?? "")}
                onUploaded={(url) => onChange({ ...data, [key]: url })}
              />
            ) : (
              <FieldInput
                label={key}
                value={String(data[key] ?? "")}
                onChange={(v) =>
                  onChange({ ...data, [key]: typeof data[key] === "number" ? Number(v) : v })
                }
                textarea={
                  key === "subtext" ||
                  key === "description" ||
                  key === "message" ||
                  String(data[key]).length > 80
                }
              />
            )}
          </div>
        ))}
      </div>
    );
  }
  return null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ─── Clips Manager (DnD + Upload) ─────────────────────── */

type Clip = {
  id: string;
  brand: string;
  title: string;
  title_accent: string;
  accent_color: string;
  views: string;
  image: string;
  position: number;
};

function ClipsManager() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("clips")
      .select("*")
      .order("position", { ascending: true });
    setClips((data as Clip[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setClips((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const addClip = async () => {
    const nextPos = (clips[clips.length - 1]?.position ?? 0) + 1;
    await supabase.from("clips").insert({
      brand: "NEW BRAND",
      title: "TITLE",
      title_accent: "ACCENT",
      accent_color: "red",
      views: "0 VIEWS",
      image: "",
      position: nextPos,
    });
    load();
  };

  const updateClip = (id: string, patch: Partial<Clip>) => {
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const saveAll = async () => {
    setSaving(true);
    // Re-assign positions based on current order
    const updates = clips.map((c, i) =>
      supabase
        .from("clips")
        .update({
          brand: c.brand,
          title: c.title,
          title_accent: c.title_accent,
          accent_color: c.accent_color,
          views: c.views,
          image: c.image,
          position: i + 1,
        })
        .eq("id", c.id),
    );
    await Promise.all(updates);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    load();
  };

  const deleteClip = async (id: string) => {
    if (!confirm("Delete this clip?")) return;
    await supabase.from("clips").delete().eq("id", id);
    load();
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="flex-1 text-sm font-bold uppercase tracking-widest text-white">Clips</h2>
        <p className="text-[10px] text-muted-foreground">
          Drag rows to reorder. Click Save All to persist.
        </p>
        <button
          type="button"
          onClick={addClip}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-card"
        >
          <Plus className="h-4 w-4" /> Add clip
        </button>
        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : saved ? (
            <Check className="h-3 w-3" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          {saved ? "Saved!" : "Save All"}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={clips.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {clips.map((clip) => (
              <SortableClipRow
                key={clip.id}
                clip={clip}
                onChange={(patch) => updateClip(clip.id, patch)}
                onDelete={() => deleteClip(clip.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {clips.length === 0 && (
        <p className="text-sm text-muted-foreground">No clips yet. Add one to get started.</p>
      )}
    </div>
  );
}

function SortableClipRow({
  clip,
  onChange,
  onDelete,
}: {
  clip: Clip;
  onChange: (p: Partial<Clip>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: clip.id,
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const [fetchingIg, setFetchingIg] = useState(false);

  const fetchIgDetails = async () => {
    if (!clip.image || !clip.image.includes("instagram.com")) return;
    setFetchingIg(true);
    const match = clip.image.match(/instagram\.com\/(reel|p|tv)\/([A-Za-z0-9_-]+)/i);
    try {
      // Use corsproxy wrapper to avoid browser CORS block on instagram oembed endpoint
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://www.instagram.com/oembed/?url=${clip.image}`)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const data = await res.json();
        const updates: Partial<Clip> = {};
        if (data.author_name) updates.brand = String(data.author_name).toUpperCase();
        if (data.title) {
          const firstLine = String(data.title).split("\n")[0].substring(0, 30);
          updates.title = firstLine.toUpperCase();
        }
        if (Object.keys(updates).length > 0) {
          onChange(updates);
          setFetchingIg(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Instagram oembed CORS fallback", err);
    }

    // Smart fallback if oembed endpoint is rate-limited
    if (match && match[2]) {
      const shortcode = match[2].substring(0, 8).toUpperCase();
      onChange({
        brand: clip.brand || "INSTAGRAM REEL",
        title: clip.title || `REEL #${shortcode}`,
      });
    }
    setFetchingIg(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition",
        isDragging && "z-50 opacity-75 shadow-2xl ring-1 ring-primary",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab touch-none text-muted-foreground hover:text-white active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <FieldInput label="Brand" value={clip.brand} onChange={(v) => onChange({ brand: v })} />
          <FieldInput label="Title" value={clip.title} onChange={(v) => onChange({ title: v })} />
          <FieldInput
            label="Title Accent"
            value={clip.title_accent}
            onChange={(v) => onChange({ title_accent: v })}
          />
          <FieldInput label="Views" value={clip.views} onChange={(v) => onChange({ views: v })} />
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Accent Color
            </label>
            <select
              value={clip.accent_color}
              onChange={(e) => onChange({ accent_color: e.target.value })}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="red">Red</option>
              <option value="yellow">Yellow</option>
              <option value="green">Green</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <MediaUploadField
              clipId={clip.id}
              label="Clip Video / Image"
              currentUrl={clip.image}
              onUploaded={(url) => onChange({ image: url })}
            />
            {clip.image && clip.image.includes("instagram.com") && (
              <button
                type="button"
                onClick={fetchIgDetails}
                disabled={fetchingIg}
                className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-md bg-pink-600/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-pink-400 hover:bg-pink-600/30 disabled:opacity-60"
              >
                {fetchingIg ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                Auto-fetch IG Details
              </button>
            )}
          </div>
          <div className="flex flex-col justify-end">
            <label className="flex items-center justify-between gap-2 rounded-md border border-border bg-background/50 px-3 py-2 cursor-pointer h-[38px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Show Details Below Reel
              </span>
              <input
                type="checkbox"
                checked={(clip as any).show_details !== false}
                onChange={(e) => onChange({ show_details: e.target.checked })}
                className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
              />
            </label>
          </div>
        </div>

        <button type="button" onClick={onDelete} className="mt-1 text-muted-foreground hover:text-primary">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Media / Video / Image Upload Field ───────────────────── */

async function compressImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type.includes("gif") || file.type.includes("svg")) {
    return file;
  }
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const maxDim = 1920;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          resolve(new File([blob], newName, { type: "image/webp" }));
        },
        "image/webp",
        0.82
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

function MediaUploadField({
  clipId,
  label = "Image / Video",
  currentUrl,
  onUploaded,
}: {
  clipId: string;
  label?: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (rawFile: File) => {
    setUploading(true);
    setError(null);
    const file = await compressImageForUpload(rawFile);
    const ext = file.name.split(".").pop() ?? "bin";
    const filename = `media_${clipId}_${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(filename, file, { upsert: false, cacheControl: "31536000" });
    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(filename);
    onUploaded(data.publicUrl);
    setUploading(false);
  };

  const isVideo = currentUrl && /\.(mp4|webm|mov|m4v|ogg|qt|mkv|avi)(\?|#|$)/i.test(currentUrl);
  const isValidUrl = currentUrl && (currentUrl.startsWith("http") || currentUrl.startsWith("data:") || currentUrl.startsWith("/"));

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-white hover:bg-background disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Upload className="h-3 w-3" />
          )}
          {uploading ? "Uploading…" : "Upload Device File"}
        </button>
        {isValidUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-white"
          >
            <ImageIcon className="h-3 w-3" /> View
          </a>
        )}
        <input
          type="url"
          value={currentUrl}
          placeholder="…or paste image/video URL / Instagram Reel link"
          onChange={(e) => {
            const val = e.target.value;
            if (val.startsWith("file://") || val.startsWith("C:\\") || val.startsWith("D:\\")) {
              alert("Local files cannot be saved. Please click 'Upload Device File' instead.");
              onUploaded(""); // Clear invalid value
              return;
            }
            onUploaded(val);
          }}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-2 text-[11px] text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>
      {error && <p className="text-[10px] text-red-400">{error}</p>}
      {currentUrl && currentUrl.startsWith("file://") && (
        <p className="text-[10px] text-yellow-500 mt-1">Local file paths are not supported. Please click "Upload Device File".</p>
      )}
      {isValidUrl && isVideo && (
        <video
          src={currentUrl}
          className="mt-2 h-20 w-36 rounded border border-border bg-black object-cover"
          muted
          playsInline
          loop
          autoPlay
        />
      )}
      {isValidUrl && !isVideo && (
        <img
          src={currentUrl}
          alt="Preview"
          className="mt-2 h-20 w-36 rounded border border-border object-cover"
        />
      )}
    </div>
  );
}

/* ─── Messages Tab ──────────────────────────────────────── */

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

function MessagesTab() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Message[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === "unread" ? items.filter((m) => !m.read) : items),
    [items, filter],
  );
  const toggle = async (m: Message) => {
    await supabase.from("contact_messages").update({ read: !m.read }).eq("id", m.id);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages").delete().eq("id", id);
    load();
  };

  if (loading) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">
          Messages ({items.length})
        </h2>
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-white",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-lg border bg-card p-4",
              m.read ? "border-border" : "border-primary/60",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-white">
                  {m.name} <span className="text-muted-foreground">· {m.email}</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(m)}
                  className="rounded-md border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white hover:border-primary hover:text-primary"
                >
                  {m.read ? "Mark unread" : "Mark read"}
                </button>
                <button
                  onClick={() => remove(m.id)}
                  className="rounded-md border border-border px-2 py-1 text-white hover:border-primary hover:text-primary"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{m.message}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No messages.</p>}
      </div>
    </div>
  );
}
