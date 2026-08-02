import { ArrowRight } from "lucide-react";
import { AccentTitle, Container } from "./primitives";
import { CtaLink } from "./Cta";

export function BottomCTA({
  data,
}: {
  data: {
    eyebrow: string;
    titleParts: { text: string; accent?: boolean }[];
    subtext: string;
    cta: { label: string; to: string };
  };
}) {
  return (
    <section className="relative overflow-hidden bg-background border-t border-border">
      {/* Radial red spotlight glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px] pointer-events-none" />
      
      {/* Floating ember particles like in Site 2.png */}
      <div className="absolute top-1/4 left-1/4 h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_8px_rgba(222,27,36,0.8)] animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 h-1 w-1 rounded-full bg-primary/60 shadow-[0_0_6px_rgba(222,27,36,0.8)] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 h-2 w-2 rounded-full bg-primary/80 shadow-[0_0_10px_rgba(222,27,36,1)] animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 h-1 w-1 rounded-full bg-red-400/50 shadow-[0_0_6px_rgba(222,27,36,0.8)] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/6 h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_8px_rgba(222,27,36,0.8)] pointer-events-none" />

      <Container className="relative py-20 md:py-28 text-center z-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          {data.eyebrow}
        </p>
        {data.title ? (
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black uppercase tracking-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
            {data.title}
          </h2>
        ) : (
          <AccentTitle
            parts={data.titleParts}
            className="mx-auto mt-6 max-w-3xl text-4xl md:text-5xl lg:text-6xl drop-shadow-md"
          />
        )}
        <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground leading-relaxed">{data.subtext}</p>
        <div className="mt-8 flex justify-center">
          <CtaLink to={data.cta.to} size="lg" variant="red">
            {data.cta.label} <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}

