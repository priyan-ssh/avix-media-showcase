import { ArrowRight } from "lucide-react";
import { CtaLink } from "./Cta";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { AccentTitle, Container, Eyebrow } from "./primitives";
import type home from "@/content/home.json";

type Hero = typeof home.hero;

export function Hero({ data }: { data: Hero }) {
  return (
    <section className="relative border-b border-border overflow-hidden bg-background">
      {/* Huge ambient red/orange spotlight glow like in Site 2.png */}
      <div className="absolute top-1/4 right-5 -z-10 h-[500px] w-[500px] rounded-full bg-primary/25 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <Container className="grid grid-cols-1 gap-8 py-16 md:grid-cols-12 md:gap-8 md:py-24">
        <div className="md:col-span-6 flex flex-col justify-center z-10">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <AccentTitle parts={data.titleParts} className="mt-6 text-5xl md:text-6xl lg:text-7xl" />

          {/* MOBILE ONLY: Display hero image immediately below headline on phone screens! */}
          <div className="mt-8 md:hidden relative flex items-center justify-center">
            <div className="absolute -inset-8 bg-gradient-to-tr from-red-600/40 via-primary/30 to-transparent blur-[110px] opacity-90 pointer-events-none -z-10" />
            <div 
              className="relative w-full max-w-[450px] overflow-hidden bg-transparent"
              style={{
                maskImage: "radial-gradient(ellipse at center, black 40%, transparent 95%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 95%)"
              }}
            >
              <MediaPlaceholder
                src={data.image}
                alt="Aviix editing"
                aspect="4/5"
                priority={true}
                className="w-full h-full object-cover rounded-none border-0"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,5,5,0.9)_100%)] pointer-events-none" />
            </div>
          </div>

          <p className="mt-6 max-w-md text-sm md:text-base text-muted-foreground leading-relaxed">
            {data.subtext}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to={data.primaryCta.to} variant="red" size="lg">
              {data.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </CtaLink>
            <CtaLink to={data.secondaryCta.to} variant="outline" size="lg">
              {data.secondaryCta.label} <ArrowRight className="h-4 w-4 text-primary" />
            </CtaLink>
          </div>
          <div className="mt-14 hidden md:flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            <span className="inline-flex h-7 w-4 items-start justify-center rounded-full border-2 border-muted-foreground/60 p-1">
              <span className="h-1.5 w-1 rounded-full bg-white animate-bounce" />
            </span>
            Scroll to explore
          </div>
        </div>

        {/* DESKTOP ONLY: Hero image on the right column */}
        <div className="hidden md:flex md:col-span-6 relative items-center justify-center">
          {/* Backlight glow behind media */}
          <div className="absolute -inset-10 bg-gradient-to-tr from-red-600/40 via-primary/30 to-transparent blur-[130px] opacity-90 pointer-events-none -z-10" />

          {/* Unboxed frameless image radially merging into background as gradient */}
          <div 
            className="relative w-full max-w-[550px] overflow-hidden bg-transparent"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 95%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 95%)"
            }}
          >
            <MediaPlaceholder
              src={data.image}
              alt="Aviix editing"
              aspect="4/5"
              priority={true}
              className="w-full h-full object-cover rounded-none border-0"
            />
            {/* Cinematic vignette overlay merging into black background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(5,5,5,0.9)_100%)] pointer-events-none" />
          </div>
        </div>
      </Container>
    </section>
  );
}

