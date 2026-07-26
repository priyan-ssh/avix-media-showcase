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
      {/* Blue/Cyan ambient spotlight behind showreel like in Site 2.png - z-0 so it sits IN FRONT of the black background! */}
      <div className="absolute top-1/2 right-1/4 z-0 h-[500px] w-[600px] -translate-y-1/2 rounded-full bg-sky-500/25 blur-[150px] pointer-events-none" />

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

        <div className="md:col-span-7 relative flex items-center justify-end -mr-16 lg:-mr-28">
          {/* Vibrant Permanent Cyan Spotlight + Dynamic Highlighted Color Glow Backlight sitting at z-0! */}
          <div className="absolute -inset-10 rounded-full bg-sky-500/50 blur-[100px] pointer-events-none z-0" />
          <div 
            className="absolute -inset-20 rounded-full blur-[90px] opacity-100 pointer-events-none z-0 transition-all duration-1000"
            style={{ 
              background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
              boxShadow: `0 0 160px 80px ${glowColor}`
            }}
          />

          {/* BIGGER & STRONGER CIRCULAR BLACK CLOUD AT z-5 MERGING OUTWARDS INTO CYAN GLOW! */}
          <div className="absolute -inset-16 rounded-full bg-[#0a0a0a] blur-[50px] opacity-100 pointer-events-none z-5" />
          <div className="absolute -inset-24 rounded-full bg-[#0a0a0a] blur-[90px] opacity-95 pointer-events-none z-5" />

          {/* Deep edgeless showreel container offset towards right edge with solid black edge fading! */}
          <div className="relative w-full max-w-[650px] overflow-hidden bg-transparent z-10">
            <MediaPlaceholder
              src={data.image}
              alt="Showreel thumbnail"
              aspect="16/9"
              priority={true}
              className="w-full h-full object-cover rounded-none border-0"
            />
            {/* REDUCED INNER BLACK VIGNETTE + NARROWER 4-WAY EDGE FADING: Keeps image clear and bright while blending boundaries! */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,10,10,0.75)_80%,#0a0a0a_98%)] pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/75 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </Container>
    </section>
  );
}

