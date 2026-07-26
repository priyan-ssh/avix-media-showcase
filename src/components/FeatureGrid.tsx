import { Zap, Star, Globe, type LucideIcon } from "lucide-react";
import { Container } from "./primitives";

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  star: Star,
  globe: Globe,
};

export function FeatureGrid({
  features,
}: {
  features: { icon: string; title: string; description: string }[];
}) {
  return (
    <section className="border-b border-border bg-background">
      <Container className="grid grid-cols-1 gap-10 py-14 md:grid-cols-3 md:gap-12 md:py-16">
        {features.map((f) => {
          const Icon = iconMap[f.icon] ?? Zap;
          return (
            <div key={f.title} className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/50 bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
