import { useState } from "react";
import { ArrowRight, Instagram, Mail, MapPin, type LucideIcon } from "lucide-react";
import { AccentTitle, Container, Eyebrow } from "./primitives";
import { CtaButton } from "./Cta";

const iconMap: Record<string, LucideIcon> = {
  mail: Mail,
  instagram: Instagram,
  "map-pin": MapPin,
};

export function ContactSplit({
  data,
}: {
  data: {
    eyebrow: string;
    titleParts: { text: string; accent?: boolean }[];
    subtext: string;
    details: { icon: string; label: string; href: string }[];
    form: {
      namePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
      submitLabel: string;
    };
  };
}) {
  const [sent, setSent] = useState(false);

  return (
    <section className="bg-background">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <div>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <AccentTitle
            parts={data.titleParts}
            className="mt-6 text-4xl md:text-5xl lg:text-6xl"
          />
          <p className="mt-5 max-w-md text-sm text-muted-foreground">
            {data.subtext}
          </p>
          <ul className="mt-10 space-y-4">
            {data.details.map((d) => {
              const Icon = iconMap[d.icon] ?? Mail;
              const content = (
                <span className="flex items-center gap-3 text-sm text-white">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  {d.label}
                </span>
              );
              return (
                <li key={d.label}>
                  {d.href ? (
                    <a href={d.href} className="hover:text-primary">
                      {content}
                    </a>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="flex flex-col gap-4"
        >
          <input
            required
            type="text"
            placeholder={data.form.namePlaceholder}
            className="w-full rounded-md border border-border bg-card px-4 py-4 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder={data.form.emailPlaceholder}
            className="w-full rounded-md border border-border bg-card px-4 py-4 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <textarea
            required
            rows={7}
            placeholder={data.form.messagePlaceholder}
            className="w-full rounded-md border border-border bg-card px-4 py-4 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          />
          <CtaButton type="submit" size="lg" className="w-full">
            {sent ? "MESSAGE SENT" : data.form.submitLabel}
            <ArrowRight className="h-4 w-4" />
          </CtaButton>
        </form>
      </Container>
    </section>
  );
}
