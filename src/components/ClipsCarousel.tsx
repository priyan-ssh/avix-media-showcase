import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Container } from "./primitives";
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
  red: "shadow-[0_0_60px_-15px_rgba(222,27,36,0.6)] border-primary/40",
  yellow: "shadow-[0_0_60px_-15px_rgba(250,204,21,0.5)] border-yellow-500/40",
  green: "shadow-[0_0_60px_-15px_rgba(74,222,128,0.5)] border-green-500/40",
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
  const [emblaRef, embla] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla, onSelect]);

  return (
    <section className="border-b border-border bg-background">
      <Container className="py-16 md:py-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </span>
          </div>
          <a
            href={viewAll.to}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-white"
          >
            {viewAll.label} <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="relative mt-8">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {items.map((clip, i) => (
                <div
                  key={i}
                  className="min-w-0 shrink-0 basis-[80%] sm:basis-[45%] md:basis-[32%]"
                >
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border bg-card",
                      ringClass[clip.accentColor],
                    )}
                  >
                    <MediaPlaceholder
                      src={clip.image}
                      alt={clip.title}
                      aspect="9/16"
                      className="rounded-none border-0"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                        {clip.brand}
                      </span>
                      <div>
                        <div className="text-2xl font-black uppercase leading-tight text-white">
                          {clip.title}
                        </div>
                        <div
                          className={cn(
                            "text-2xl font-black uppercase leading-tight",
                            accentClass[clip.accentColor],
                          )}
                        >
                          {clip.titleAccent}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <Play className="h-3 w-3 fill-primary text-primary" />
                    {clip.views}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => embla?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous"
            className="absolute -left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 p-3 text-white shadow-lg backdrop-blur transition disabled:opacity-30 md:inline-flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => embla?.scrollNext()}
            disabled={!canNext}
            aria-label="Next"
            className="absolute -right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 p-3 text-white shadow-lg backdrop-blur transition disabled:opacity-30 md:inline-flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}
