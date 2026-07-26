import { createFileRoute } from "@tanstack/react-router";
import home from "@/content/home.json";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { PartnerLogos } from "@/components/PartnerLogos";
import { Showreel } from "@/components/Showreel";
import { ClipsCarousel } from "@/components/ClipsCarousel";
import { BottomCTA } from "@/components/BottomCTA";

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
        content:
          "Long-form content turned into engaging short videos. 400M+ views generated.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero data={home.hero} />
      <StatsBar stats={home.stats} />
      <PartnerLogos label={home.partners.label} logos={home.partners.logos} />
      <Showreel data={home.showreel} />
      <ClipsCarousel
        eyebrow={home.clips.eyebrow}
        viewAll={home.clips.viewAll}
        items={home.clips.items as never}
      />
      <BottomCTA data={home.bottomCta} />
    </>
  );
}
