import { Container } from "./primitives";

export function StatsBar({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section className="border-b border-border bg-background">
      <Container>
        <div className="grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12 relative">
          {stats.map((s, i) => (
            <div key={s.label} className="relative flex flex-col items-center text-center">
              {i > 0 && (
                <div className="hidden md:flex absolute -left-0 top-1/2 -translate-y-1/2 flex-col items-center justify-center">
                  <div className="h-6 w-px bg-border/80" />
                  <div className="my-1.5 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(222,27,36,1)]" />
                  <div className="h-6 w-px bg-border/80" />
                </div>
              )}
              <div className="text-3xl md:text-4xl font-black text-white tracking-tight">{s.value}</div>
              <div className="mt-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

