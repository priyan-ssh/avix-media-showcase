import { ArrowRight, MousePointer2 } from "lucide-react";
import { CtaLink } from "./Cta";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { AccentTitle, Container, Eyebrow } from "./primitives";
import type home from "@/content/home.json";

type Hero = typeof home.hero;

export function Hero({ data }: { data: Hero }) {
  return (
    <section className="relative border-b border-border">
      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-24">
        <div className="md:col-span-6 flex flex-col justify-center">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <AccentTitle parts={data.titleParts} className="mt-6 text-5xl md:text-6xl lg:text-7xl" />
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
          <div className="mt-12 hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="inline-flex h-6 w-4 items-start justify-center rounded-full border border-muted-foreground/60 pt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </span>
            Scroll to explore
          </div>
        </div>
        <div className="md:col-span-6">
          <MediaPlaceholder
            src={data.image}
            alt="Aviix editing"
            aspect="4/5"
            label="Hero portrait"
          />
        </div>
      </Container>
    </section>
  );
}
