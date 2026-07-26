import { Container } from "./primitives";

export type PartnerItem = string | { name: string; url?: string };

export function PartnerLogos({ label, logos }: { label: string; logos: PartnerItem[] }) {
  return (
    <section className="border-b border-border bg-background">
      <Container className="py-10 md:py-14">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-0 gap-y-6">
          {logos.map((item, i) => {
            const name = typeof item === "string" ? item : item.name;
            const url = typeof item === "string" ? "#" : item.url || "#";
            const isExternal = url !== "#" && url.startsWith("http");

            return (
              <div key={name + i} className="flex items-center">
                <a
                  href={url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="px-6 text-center text-sm md:text-base font-black uppercase tracking-widest text-muted-foreground/80 hover:text-white transition-colors cursor-pointer no-underline visited:text-muted-foreground/80"
                >
                  {name}
                </a>
                {i < logos.length - 1 && (
                  <span className="hidden md:inline-block h-8 w-px bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
