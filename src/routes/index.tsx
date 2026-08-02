import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { PartnerLogos } from "@/components/PartnerLogos";
import { Showreel } from "@/components/Showreel";
import { ClipsCarousel } from "@/components/ClipsCarousel";
import { BottomCTA } from "@/components/BottomCTA";
import { useContent, useClips } from "@/hooks/useContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aviix Media — Video Editing That Gets Watched" },
      {
        name: "description",
        content:
          "Aviix Media edits long-form podcast and creator content into short-form videos that generate views and grow audiences.",
      },
      { property: "og:title", content: "Aviix Media — Video Editing That Gets Watched" },
      {
        property: "og:description",
        content: "Long-form content turned into engaging short videos. 400M+ views generated.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const home = useContent("home");
  const clips = useClips();
  return (
    <>
      {(home.hero as any)?.show !== false && <Hero data={home.hero} />}
      {(home.stats as any)?.show !== false && <StatsBar stats={home.stats} />}
      {(home.partners as any)?.show !== false && (
        <PartnerLogos label={home.partners.label} logos={home.partners.logos} />
      )}
      {(home.showreel as any)?.show !== false && <Showreel data={home.showreel} />}
      {(home.clips as any)?.show !== false && (
        <ClipsCarousel
          eyebrow={home.clips.eyebrow}
          viewAll={home.clips.viewAll}
          items={clips.map((c) => ({
            brand: c.brand,
            title: c.title,
            titleAccent: c.title_accent,
            accentColor: (c.accent_color as "red" | "yellow" | "green") ?? "red",
            views: c.views,
            image: c.image,
            showDetails: (c as any).show_details,
          }))}
        />
      )}
      {(home.bottomCta as any)?.show !== false && <BottomCTA data={home.bottomCta} />}
    </>
  );
}
