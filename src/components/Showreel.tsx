import { Play } from "lucide-react";
import { Container } from "./primitives";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { useImageGlowColor } from "@/hooks/useImageGlowColor";

export function Showreel({
  data,
}: {
  data: {
    eyebrow: string;
    title: string;
    subtext: string;
    cta: { label: string; href: string };
    image?: string;
  };
}) {
  const glowColor = useImageGlowColor(data.image, "rgb(14, 165, 233)");

  return (
    <section id="showreel" className="relative border-b border-border bg-background overflow-hidden">
      {/* Blue/Cyan ambient spotlight behind showreel like in Site 2.png - z-0 so it sits IN FRONT of the black background! (COMMENTED OUT TO MATCH HERO)
      <div className="absolute top-1/2 right-1/4 z-0 h-[500px] w-[600px] -translate-y-1/2 rounded-full bg-sky-500/25 blur-[150px] pointer-events-none" />
      */}

      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:py-24 relative z-10">
        <div className="md:col-span-5 flex flex-col justify-center z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {data.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl md:text-5xl">
              {data.title}
            </h2>
          </div>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            {data.subtext}
          </p>
          <div className="mt-8">
            <a
              href={data.cta.href}
              className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white/90 shadow-xl"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {data.cta.label}
            </a>
          </div>
        </div>

        <div className="md:col-span-7 relative flex items-center justify-end -mr-6 lg:-mr-10">
          {/* Balanced Blue / Cyan ambient backlight glow: Left, Top, Bottom & Center (No Glow on Right) */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[540px] rounded-full bg-sky-500/45 blur-[110px] pointer-events-none z-0" />
          <div className="absolute top-1/4 -left-12 h-[320px] w-[350px] rounded-full bg-cyan-400/35 blur-[90px] pointer-events-none z-0" />
          <div className="absolute bottom-1/4 -left-12 h-[320px] w-[350px] rounded-full bg-sky-400/35 blur-[90px] pointer-events-none z-0" />

          {/* CIRCULAR BLACK CLOUD AT z-5 MERGING OUTWARDS RADIALLY LIKE HERO! */}
          <div className="absolute -inset-16 rounded-full bg-[#0a0a0a] blur-[50px] opacity-100 pointer-events-none z-5" />
          <div className="absolute -inset-24 rounded-full bg-[#0a0a0a] blur-[90px] opacity-95 pointer-events-none z-5" />

          {/* Deep edgeless showreel container */}
          <div className="relative w-full max-w-[650px] overflow-hidden bg-transparent z-10">
            <MediaPlaceholder
              src={data.image}
              alt="Showreel thumbnail"
              aspect="16/10.5"
              priority={true}
              className="w-full h-full object-cover object-[center_0%] rounded-none border-0"
            />
            {/* INNER RADIAL BLACK VIGNETTE: Radiates outwards from center like Hero */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,10,10,0.75)_80%,#0a0a0a_98%)] pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none" />
          </div>
        </div>
      </Container>
    </section>
  );
}

