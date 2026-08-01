import { Container } from "./primitives";

export type PartnerItem =
  | string
  | { name: string; url?: string; logo?: string };

export function PartnerLogos({
  label,
  logos,
}: {
  label: string;
  logos: PartnerItem[];
}) {
  if (!logos || logos.length === 0) return null;

  // Duplicate items to ensure a seamless 100% infinite scroll loop
  const marqueeItems = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="border-b border-border bg-background overflow-hidden py-10 md:py-14">
      <Container className="mb-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </p>
      </Container>

      {/* Infinite Scrolling Marquee Container with subtle edge fade masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max items-center gap-12 sm:gap-16 md:gap-20 animate-marquee hover:[animation-play-state:paused] py-2">
          {marqueeItems.map((item, i) => {
            const name = typeof item === "string" ? item : item.name;
            const url = typeof item === "string" ? "#" : item.url || "#";
            const logo = typeof item === "string" ? undefined : item.logo;
            const isExternal = url !== "#" && url.startsWith("http");

            return (
              <a
                key={`${name}-${i}`}
                href={url}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group flex items-center justify-center shrink-0 transition-all duration-300 no-underline"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={name}
                    className="h-8 sm:h-10 md:h-12 w-auto max-w-[140px] md:max-w-[180px] object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <span className="text-sm md:text-base font-black uppercase tracking-widest text-muted-foreground/80 group-hover:text-white group-hover:scale-105 transition-all duration-300">
                    {name}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
