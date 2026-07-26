import { Play } from "lucide-react";
import { Container } from "./primitives";
import { MediaPlaceholder } from "./MediaPlaceholder";

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
  return (
    <section id="showreel" className="relative border-b border-border bg-background overflow-hidden">
      {/* Blue/Cyan ambient spotlight behind showreel like in Site 2.png */}
      <div className="absolute top-1/2 right-1/4 -z-10 h-[500px] w-[600px] -translate-y-1/2 rounded-full bg-sky-500/20 blur-[150px] pointer-events-none" />

      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5 flex flex-col justify-center z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {data.eyebrow}
            </span>
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-black leading-tight text-white">
            {data.title}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{data.subtext}</p>
          <a
            href={data.cta.href}
            className="mt-8 inline-flex w-fit items-center gap-4 rounded-lg border border-border/80 bg-zinc-950/80 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:border-primary hover:bg-black hover:shadow-[0_0_30px_-5px_rgba(222,27,36,0.6)] group"
          >
            <span>{data.cta.label}</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/80 bg-primary/15 text-primary transition-transform group-hover:scale-110">
              <Play className="h-3 w-3 fill-primary" />
            </span>
          </a>
        </div>

        <div className="md:col-span-7 relative flex items-center">
          {/* Cyan ambient spotlight behind showreel */}
          <div className="absolute -inset-10 bg-gradient-to-l from-sky-500/35 via-blue-600/25 to-transparent blur-[140px] opacity-85 pointer-events-none -z-10" />

          {/* Frameless showreel player radially merging into background */}
          <div 
            className="relative w-full overflow-hidden bg-transparent"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 55%, transparent 98%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 98%)"
            }}
          >
            <MediaPlaceholder
              src={data.image}
              alt="Showreel thumbnail"
              aspect="16/9"
              priority={true}
              className="w-full h-full object-cover rounded-none border-0"
            />
            {/* Cinematic vignette overlay merging into black background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(5,5,5,0.85)_100%)] pointer-events-none" />
          </div>
        </div>
      </Container>
    </section>
  );
}

