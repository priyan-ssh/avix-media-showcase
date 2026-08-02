import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Container, Eyebrow } from "./primitives";
import { CtaLink } from "./Cta";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { cn } from "@/lib/utils";
import { InstagramReelModal } from "./InstagramReelModal";

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
    items.length >= 3 && items.length < 8 ? [...items, ...items, ...items, ...items] : items;

  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: true, dragFree: true }, [
    WheelGesturesPlugin(),
  ]);

  const [, forceUpdate] = useState(0);
  const [selectedReel, setSelectedReel] = useState<string | null>(null);

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
          <CtaLink to={viewAll.to} variant="outline" size="md">
            {viewAll.label} <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </CtaLink>
        </div>

        <div className="relative mt-8">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {displayItems.map((clip, i) => (
                <div key={i} className="min-w-0 shrink-0 basis-[80%] sm:basis-[45%] md:basis-[32%] py-2 px-1">
                  <div
                    onClick={() => {
                      if (clip.image && clip.image.includes("instagram.com")) {
                        setSelectedReel(clip.image);
                      }
                    }}
                    className={cn(
                      "group relative rounded-[18px] transition-all duration-300 hover:scale-[1.02]",
                      clip.image && clip.image.includes("instagram.com") && "cursor-pointer",
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
                        className="rounded-none border-0 pointer-events-none"
                      />
                      {/* Transparent Overlay so mouse wheel scrolling & drag gestures work smoothly anywhere over the reel */}
                      <div className="absolute inset-0 z-10 cursor-pointer" />
                    </div>
                  </div>

                  {/* Metadata section placed BELOW the reel card (hideable via clip.showDetails) */}
                  {clip.showDetails !== false && (clip.brand || clip.title || clip.views) ? (
                    <div className="mt-3.5 flex flex-col gap-1 px-1">
                      {clip.brand && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {clip.brand}
                        </span>
                      )}
                      {(clip.title || clip.titleAccent) && (
                        <div className="text-base font-black uppercase leading-tight text-white">
                          {clip.title} {clip.titleAccent && <span className={accentClass[clip.accentColor]}>{clip.titleAccent}</span>}
                        </div>
                      )}
                      {clip.views && (
                        <div className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                          <span
                            className={cn(
                              "inline-flex h-5 w-5 items-center justify-center rounded-full border bg-black/60 shadow-sm",
                              clip.accentColor === "red" && "border-primary/80 text-primary bg-primary/10",
                              clip.accentColor === "yellow" && "border-yellow-500/80 text-yellow-400 bg-yellow-500/10",
                              clip.accentColor === "green" && "border-green-500/80 text-green-400 bg-green-500/10",
                            )}
                          >
                            <Play className="h-2 w-2 fill-current" />
                          </span>
                          <span>{clip.views}</span>
                        </div>
                      )}
                    </div>
                  ) : null}
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
      <InstagramReelModal
        isOpen={!!selectedReel}
        onClose={() => setSelectedReel(null)}
        reelUrl={selectedReel}
      />
    </section>
  );
}

