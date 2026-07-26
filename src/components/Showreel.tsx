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
    <section id="showreel" className="border-b border-border bg-background">
      <Container className="grid grid-cols-1 gap-8 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {data.eyebrow}
            </span>
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-black leading-tight text-white">
            {data.title}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">{data.subtext}</p>
          <a
            href={data.cta.href}
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-md border border-border px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:border-primary"
          >
            {data.cta.label}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary">
              <Play className="h-3 w-3 fill-primary" />
            </span>
          </a>
        </div>
        <div className="md:col-span-7">
          <MediaPlaceholder
            src={data.image}
            alt="Showreel thumbnail"
            aspect="16/9"
            label="Showreel"
          />
        </div>
      </Container>
    </section>
  );
}
