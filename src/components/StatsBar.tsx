import { Container } from "./primitives";

export function StatsBar({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <Container>
        <div className="grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={
                "relative flex flex-col items-center text-center " +
                (i > 0 ? "md:before:content-[''] md:before:absolute md:before:left-0 md:before:top-1/2 md:before:-translate-y-1/2 md:before:h-10 md:before:w-px md:before:bg-primary/70" : "")
              }
            >
              <div className="text-3xl md:text-4xl font-black text-white">
                {s.value}
              </div>
              <div className="mt-2 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
