import { ArrowRight } from "lucide-react";
import { CtaLink } from "./Cta";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { AccentTitle, Container, Eyebrow } from "./primitives";
import { useImageGlowColor } from "@/hooks/useImageGlowColor";
import type home from "@/content/home.json";

type Hero = typeof home.hero;

export function Hero({ data }: { data: Hero }) {
  const glowColor = useImageGlowColor(data.image, "rgb(222, 27, 36)");

  return (
    <section className="relative border-b border-border overflow-hidden bg-background">
      {/* Huge ambient spotlight glow like in Site 2.png - z-0 so it sits IN FRONT of the black background! */}
      <div className="absolute top-1/4 right-5 z-0 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 z-0 h-[350px] w-[350px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <Container className="grid grid-cols-1 gap-8 py-16 md:grid-cols-12 md:gap-8 md:py-24 relative z-10">
        <div className="md:col-span-6 flex flex-col justify-center z-10">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <AccentTitle parts={data.titleParts} className="mt-6 text-5xl md:text-6xl lg:text-7xl" />

          {/* MOBILE ONLY: Display hero image immediately below headline on phone screens! */}
          <div className="mt-8 md:hidden relative flex items-center justify-center">
            {/* Vibrant Permanent Red Spotlight + Dynamic Highlighted Color Glow Backlight sitting at z-0! (COMMENTED OUT AS REQUESTED)
            <div className="absolute -inset-8 rounded-full bg-primary/60 blur-[90px] pointer-events-none z-0" />
            <div 
              className="absolute -inset-16 rounded-full blur-[80px] opacity-100 pointer-events-none z-0 transition-all duration-1000"
              style={{ 
                background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
                boxShadow: `0 0 140px 70px ${glowColor}`
              }}
            />
            */}
            {/* BIGGER & STRONGER CIRCULAR BLACK CLOUD AT z-5 MERGING OUTWARDS INTO RED GLOW! */}
            <div className="absolute -inset-14 rounded-full bg-[#0a0a0a] blur-[45px] opacity-100 pointer-events-none z-5" />
            <div className="absolute -inset-20 rounded-full bg-[#0a0a0a] blur-[80px] opacity-95 pointer-events-none z-5" />
            <div className="relative w-full max-w-[450px] overflow-hidden bg-transparent z-10">
              <MediaPlaceholder
                src={data.image}
                alt="Aviix editing"
                aspect="4/5"
                priority={true}
                className="w-full h-full object-cover rounded-none border-0"
              />
              {/* CUSTOM INNER BLACK: More on top, reduced on right! */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,10,10,0.75)_80%,#0a0a0a_98%)] pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/75 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent pointer-events-none" />
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

        {/* DESKTOP ONLY: Hero image on the right column moved right close to end of page */}
        <div className="hidden md:flex md:col-span-6 relative items-center justify-end -mr-16 lg:-mr-28">
          {/* Vibrant Permanent Red Spotlight + Dynamic Highlighted Color Glow Backlight sitting at z-0! (COMMENTED OUT AS REQUESTED)
          <div className="absolute -inset-10 rounded-full bg-primary/60 blur-[100px] pointer-events-none z-0" />
          <div 
            className="absolute -inset-20 rounded-full blur-[90px] opacity-100 pointer-events-none z-0 transition-all duration-1000"
            style={{ 
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              boxShadow: `0 0 160px 80px ${glowColor}`
            }}
          />
          */}

          {/* BIGGER & STRONGER CIRCULAR BLACK CLOUD AT z-5 MERGING OUTWARDS INTO RED GLOW! */}
          <div className="absolute -inset-16 rounded-full bg-[#0a0a0a] blur-[50px] opacity-100 pointer-events-none z-5" />
          <div className="absolute -inset-24 rounded-full bg-[#0a0a0a] blur-[90px] opacity-95 pointer-events-none z-5" />

          {/* Deep edgeless image container offset towards right edge with solid black edge fading! */}
          <div className="relative w-full max-w-[550px] overflow-hidden bg-transparent z-10">
            <MediaPlaceholder
              src={data.image}
              alt="Aviix editing"
              aspect="4/5"
              priority={true}
              className="w-full h-full object-cover rounded-none border-0"
            />
            {/* CUSTOM INNER BLACK: More on top, reduced on right! */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,10,10,0.75)_80%,#0a0a0a_98%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent pointer-events-none" />
          </div>
        </div>
      </Container>
    </section>
  );
}

