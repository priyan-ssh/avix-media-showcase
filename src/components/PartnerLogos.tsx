import { useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  if (!logos || logos.length === 0) return null;

  const renderTrack = (ariaHidden = false) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-14 sm:gap-20 md:gap-24 pr-14 sm:pr-20 md:pr-24 animate-marquee group-hover/marquee:[animation-play-state:paused] py-6 select-none"
    >
      {logos.map((item, i) => {
        const name = typeof item === "string" ? item : item.name;
        const targetUrl = typeof item === "string" ? "#" : item.url || "#";
        const logo = typeof item === "string" ? undefined : item.logo;
        const href = targetUrl && targetUrl !== "#" ? targetUrl : `https://google.com/search?q=${encodeURIComponent(name)}`;

        return (
          <div key={`${name}-${i}`} className="relative group/item shrink-0 pb-6">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={name}
              tabIndex={ariaHidden ? -1 : undefined}
              className="flex items-center justify-center transition-all duration-300 no-underline px-2"
            >
              {logo ? (
                <img
                  src={logo}
                  alt={name}
                  className="h-12 sm:h-16 md:h-20 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] object-contain drop-shadow-md transition-all duration-300 group-hover/item:scale-110"
                />
              ) : (
                <span className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest text-white transition-all duration-300 group-hover/item:text-primary group-hover/item:scale-105">
                  {name}
                </span>
              )}
            </a>

            {/* Hover Tooltip Pill - Positioned cleanly BELOW logo so it is never cut off by section top */}
            <div className="absolute top-full -mt-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-all duration-200 bg-zinc-900/95 border border-border text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-1 rounded-md shadow-2xl whitespace-nowrap z-50">
              {name} ↗
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="border-b border-border bg-background overflow-hidden py-10 md:py-14">
      <Container className="mb-4">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </p>
      </Container>

      {/* 100% Gapless Infinite Scrolling & Horizontal Wheel Scrollable Marquee */}
      <div
        ref={containerRef}
        className="group/marquee flex relative w-full overflow-x-auto no-scrollbar [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        {renderTrack(false)}
        {renderTrack(true)}
        {renderTrack(true)}
        {renderTrack(true)}
      </div>
    </section>
  );
}
