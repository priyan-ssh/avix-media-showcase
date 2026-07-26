import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { LogOut, Loader2, Trash2, Plus, Save, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Aviix Media" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
  ssr: false,
});

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(data));
    })();
  }, [session, refreshKey]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <AuthPanel />;

  if (!isAdmin) {
    return <ClaimAdminPanel onClaimed={() => setRefreshKey((k) => k + 1)} email={session.user.email ?? ""} />;
  }

  return <Dashboard email={session.user.email ?? ""} />;
}

/* ------------------------- Auth ------------------------- */

function AuthPanel() {
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
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setMsg(error ? error.message : "Check your email to confirm, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    }
    setBusy(false);
  };

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8">
        <h1 className="text-xl font-bold uppercase tracking-widest text-white">
          Admin {mode === "signup" ? "Sign up" : "Sign in"}
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
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setMsg(null);
            }}
            className="text-xs text-muted-foreground hover:text-white"
          >
            {mode === "signup" ? "Have an account? Sign in" : "Need to create the admin account? Sign up"}
          </button>
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
    if (error) {
      setMsg(error.message);
    } else if (data === false) {
      setMsg("An admin already exists. This account has no admin access.");
    } else {
      onClaimed();
    }
  };

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8">
        <h1 className="text-xl font-bold uppercase tracking-widest text-white">
          Not an admin
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <span className="text-white">{email}</span>. If this is the
          first setup, you can claim the admin role now (only works if no admin exists).
        </p>
        {msg && <p className="mt-4 text-xs text-primary">{msg}</p>}
        <div className="mt-6 flex gap-3">
          <button
            onClick={claim}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Claim admin
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white hover:bg-background"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </Container>
  );
}

/* ------------------------- Dashboard ------------------------- */

type Tab = "overview" | "home" | "about" | "contact" | "site" | "clips" | "messages";

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "site", label: "Site (nav/footer)" },
    { id: "clips", label: "Clips" },
    { id: "messages", label: "Messages" },
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
          onClick={() => supabase.auth.signOut()}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-card"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
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
      </div>
    </Container>
  );
}

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
    { label: "Unread messages", value: stats?.unread ?? "—" },
    {
      label: "Last content edit",
      value: stats?.lastEdit ? new Date(stats.lastEdit).toLocaleString() : "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-border bg-card p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            {c.label}
          </div>
          <div className="mt-2 text-2xl font-black text-white">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function ContentEditor({ page }: { page: "home" | "about" | "contact" | "site" }) {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("site_content")
      .select("data")
      .eq("page", page)
      .maybeSingle();
    setText(JSON.stringify(data?.data ?? {}, null, 2));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [page]);

  const save = async () => {
    setBusy(true);
    setMsg(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setMsg("Invalid JSON. Please fix syntax before saving.");
      setBusy(false);
      return;
    }
    const { error } = await supabase
      .from("site_content")
      .upsert({ page, data: parsed as never }, { onConflict: "page" });
    setBusy(false);
    setMsg(error ? error.message : "Saved.");
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">
          Editing: {page}
        </h2>
        <div className="flex items-center gap-2">
          {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
          <button
            onClick={save}
            disabled={busy || loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className="h-[60vh] w-full rounded-md border border-border bg-card p-4 font-mono text-xs text-white focus:border-primary focus:outline-none"
      />
      <p className="mt-2 text-xs text-muted-foreground">
        Edit the JSON directly. Changes save to the database and appear on the site
        immediately on next page load.
      </p>
    </div>
  );
}

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
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("clips").select("*").order("position", { ascending: true });
    setClips((data as Clip[]) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const addClip = async () => {
    setBusy("new");
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
    setBusy(null);
    load();
  };

  const saveClip = async (c: Clip) => {
    setBusy(c.id);
    await supabase
      .from("clips")
      .update({
        brand: c.brand,
        title: c.title,
        title_accent: c.title_accent,
        accent_color: c.accent_color,
        views: c.views,
        image: c.image,
        position: c.position,
      })
      .eq("id", c.id);
    setBusy(null);
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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">Clips</h2>
        <button
          onClick={addClip}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add clip
        </button>
      </div>
      <div className="space-y-3">
        {clips.map((c, i) => (
          <ClipRow
            key={c.id}
            clip={c}
            onChange={(next) =>
              setClips((prev) => prev.map((x, idx) => (idx === i ? next : x)))
            }
            onSave={() => saveClip(clips[i])}
            onDelete={() => deleteClip(c.id)}
            busy={busy === c.id}
          />
        ))}
        {clips.length === 0 && (
          <p className="text-sm text-muted-foreground">No clips yet. Add one to get started.</p>
        )}
      </div>
    </div>
  );
}

function ClipRow({
  clip,
  onChange,
  onSave,
  onDelete,
  busy,
}: {
  clip: Clip;
  onChange: (c: Clip) => void;
  onSave: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const field = (k: keyof Clip, type: "text" | "number" = "text") => (
    <input
      type={type}
      value={String(clip[k] ?? "")}
      onChange={(e) =>
        onChange({
          ...clip,
          [k]: type === "number" ? Number(e.target.value) : e.target.value,
        })
      }
      className="rounded-md border border-border bg-background px-2 py-2 text-xs text-white focus:border-primary focus:outline-none"
    />
  );
  return (
    <div className="grid grid-cols-1 gap-2 rounded-md border border-border bg-card p-3 md:grid-cols-[80px_1fr_1fr_1fr_120px_120px_1fr_auto]">
      {field("position", "number")}
      {field("brand")}
      {field("title")}
      {field("title_accent")}
      <select
        value={clip.accent_color}
        onChange={(e) => onChange({ ...clip, accent_color: e.target.value })}
        className="rounded-md border border-border bg-background px-2 py-2 text-xs text-white focus:border-primary focus:outline-none"
      >
        <option value="red">red</option>
        <option value="yellow">yellow</option>
        <option value="green">green</option>
      </select>
      {field("views")}
      {field("image")}
      <div className="flex items-center gap-1">
        <button
          onClick={onSave}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-2 text-white hover:border-primary hover:text-primary"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">
          Contact messages ({items.length})
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
              "rounded-md border bg-card p-4",
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
                  className="rounded-md border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white hover:border-primary hover:text-primary"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
              {m.message}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages.</p>
        )}
      </div>
    </div>
  );
}
