import { Container } from "./primitives";

export function PartnerLogos({
  label,
  logos,
}: {
  label: string;
  logos: string[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <Container className="py-10 md:py-14">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-0 gap-y-6">
          {logos.map((logo, i) => (
            <div key={logo} className="flex items-center">
              <span className="px-6 text-center text-sm md:text-base font-black uppercase tracking-widest text-muted-foreground/80 whitespace-pre-line">
                {logo}
              </span>
              {i < logos.length - 1 && (
                <span className="hidden md:inline-block h-8 w-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
