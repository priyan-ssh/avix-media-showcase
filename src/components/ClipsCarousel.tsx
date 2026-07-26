import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Container, Eyebrow } from "./primitives";
import { CtaLink } from "./Cta";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { cn } from "@/lib/utils";

type Clip = {
  brand: string;
  title: string;
  titleAccent: string;
  accentColor: "red" | "yellow" | "green";
  views: string;
  image?: string;
};

const accentClass: Record<Clip["accentColor"], string> = {
  red: "text-primary",
  yellow: "text-yellow-400",
  green: "text-green-400",
};

const ringClass: Record<Clip["accentColor"], string> = {
  red: "shadow-[0_0_40px_-5px_rgba(222,27,36,0.55)] hover:shadow-[0_0_60px_0px_rgba(222,27,36,0.85)] border-0",
  yellow: "shadow-[0_0_40px_-5px_rgba(234,179,8,0.45)] hover:shadow-[0_0_60px_0px_rgba(234,179,8,0.85)] border-0",
  green: "shadow-[0_0_40px_-5px_rgba(34,197,94,0.45)] hover:shadow-[0_0_60px_0px_rgba(34,197,94,0.85)] border-0",
};

const fadeBorderClass: Record<Clip["accentColor"], string> = {
  red: "bg-[linear-gradient(to_bottom,#ef4444_0%,transparent_70%)] group-hover:bg-[linear-gradient(to_bottom,#ef4444_0%,transparent_90%)]",
  yellow: "bg-[linear-gradient(to_bottom,#eab308_0%,transparent_70%)] group-hover:bg-[linear-gradient(to_bottom,#eab308_0%,transparent_90%)]",
  green: "bg-[linear-gradient(to_bottom,#22c55e_0%,transparent_70%)] group-hover:bg-[linear-gradient(to_bottom,#22c55e_0%,transparent_90%)]",
};

export function ClipsCarousel({
  eyebrow,
  viewAll,
  items,
}: {
  eyebrow: string;
  viewAll: { label: string; to: string };
  items: Clip[];
}) {
  const displayItems =
    items.length > 0 && items.length < 8 ? [...items, ...items, ...items, ...items] : items;

  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: true, dragFree: true }, [
    WheelGesturesPlugin(),
  ]);

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => forceUpdate((n) => n + 1);
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla]);

  return (
    <section className="relative border-b border-border bg-background overflow-hidden">
      {/* Background glow like in Site 2.png */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[600px] w-[900px] rounded-full bg-primary/10 blur-[160px] pointer-events-none" />

      <Container className="py-20 md:py-28">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <Eyebrow>PORTFOLIO</Eyebrow>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl md:text-5xl tracking-tight text-white">
              {eyebrow}
            </h2>
          </div>
          <CtaLink to={viewAll.to} variant="outline" size="sm">
            {viewAll.label} <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </CtaLink>
        </div>

        <div className="relative mt-8">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {displayItems.map((clip, i) => (
                <div key={i} className="min-w-0 shrink-0 basis-[80%] sm:basis-[45%] md:basis-[32%] py-2 px-1">
                  <div
                    className={cn(
                      "group relative rounded-[18px] transition-all duration-300 hover:scale-[1.02]",
                      ringClass[clip.accentColor],
                    )}
                  >
                    {/* Fading Gradient Border backdrop layer (simulates ::before with inset -2px) */}
                    <div
                      className={cn(
                        "absolute -inset-[2px] rounded-[20px] pointer-events-none transition-opacity duration-300 -z-10",
                        fadeBorderClass[clip.accentColor],
                      )}
                    />

                    {/* Inner Card content container with border-radius and black background */}
                    <div className="relative w-full overflow-hidden rounded-[18px] bg-black">
                      <MediaPlaceholder
                        src={clip.image}
                        alt={clip.title}
                        aspect="9/16"
                        className="rounded-none border-0"
                      />

                      {/* Top dark gradient overlay for crisp podcast/brand text */}
                      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none" />
                      {/* Bottom deep dark gradient overlay for title and views like in Site 2.png */}
                      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />

                      <div className="absolute inset-0 flex flex-col justify-between p-6 z-10 pointer-events-none">
                        <div className="text-center sm:text-left">
                          <span className="text-[11px] font-black uppercase tracking-widest text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            {clip.brand}
                          </span>
                        </div>

                      <div className="flex flex-col gap-3 text-center sm:text-left">
                        <div>
                          <div className="text-2xl font-black uppercase leading-tight text-white drop-shadow">
                            {clip.title}
                          </div>
                          <div
                            className={cn(
                              "text-2xl font-black uppercase leading-tight drop-shadow",
                              accentClass[clip.accentColor],
                            )}
                          >
                            {clip.titleAccent}
                          </div>
                        </div>

                        {/* View count and play button placed inside card at bottom left */}
                        <div className="mt-1 flex items-center justify-center sm:justify-start gap-2.5 text-xs font-bold uppercase tracking-widest text-white/90">
                          <span
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded-full border bg-black/60 shadow-sm",
                              clip.accentColor === "red" && "border-primary/80 text-primary bg-primary/10",
                              clip.accentColor === "yellow" && "border-yellow-500/80 text-yellow-400 bg-yellow-500/10",
                              clip.accentColor === "green" && "border-green-500/80 text-green-400 bg-green-500/10",
                            )}
                          >
                            <Play className="h-2.5 w-2.5 fill-current" />
                          </span>
                          <span>{clip.views}</span>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => embla?.scrollPrev()}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 p-3 text-white shadow-lg backdrop-blur transition md:inline-flex hover:bg-card hover:border-primary/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => embla?.scrollNext()}
            aria-label="Next"
            className="absolute -right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 p-3 text-white shadow-lg backdrop-blur transition md:inline-flex hover:bg-card hover:border-primary/50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}

