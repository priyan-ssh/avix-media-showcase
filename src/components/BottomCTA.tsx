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
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(222,27,36,0.25),transparent_60%)]" />
      <Container className="relative py-20 md:py-28 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {data.eyebrow}
        </p>
        <AccentTitle
          parts={data.titleParts}
          className="mx-auto mt-6 max-w-3xl text-4xl md:text-5xl lg:text-6xl"
        />
        <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground">{data.subtext}</p>
        <div className="mt-8 flex justify-center">
          <CtaLink to={data.cta.to} size="lg">
            {data.cta.label} <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </Container>
    </section>
  );
}
