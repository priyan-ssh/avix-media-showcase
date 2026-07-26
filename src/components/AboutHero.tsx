import { ArrowRight } from "lucide-react";
import { AccentTitle, Container, Eyebrow } from "./primitives";
import { CtaLink } from "./Cta";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function AboutHero({
  data,
}: {
  data: {
    eyebrow: string;
    titleParts: { text: string; accent?: boolean }[];
    paragraphs: string[];
    cta: { label: string; to: string };
    image?: string;
  };
}) {
  return (
    <section className="border-b border-border">
      <Container className="grid grid-cols-1 gap-10 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-6 flex flex-col justify-center">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <AccentTitle
            parts={data.titleParts}
            className="mt-6 text-4xl md:text-5xl lg:text-6xl"
          />
          <div className="mt-6 space-y-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            {data.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8">
            <CtaLink to={data.cta.to} variant="ghost-red" size="lg">
              {data.cta.label} <ArrowRight className="h-4 w-4" />
            </CtaLink>
          </div>
        </div>
        <div className="md:col-span-6">
          <MediaPlaceholder
            src={data.image}
            alt="Aviix at editing setup"
            aspect="4/5"
            label="About portrait"
          />
        </div>
      </Container>
    </section>
  );
}
