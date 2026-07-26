import { createFileRoute } from "@tanstack/react-router";
import about from "@/content/about.json";
import home from "@/content/home.json";
import { AboutHero } from "@/components/AboutHero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { BottomCTA } from "@/components/BottomCTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Aviix Media" },
      {
        name: "description",
        content:
          "Aviix is a video editor helping podcasters, brands and creators share their message through powerful storytelling and engaging edits.",
      },
      { property: "og:title", content: "About — Aviix Media" },
      {
        property: "og:description",
        content:
          "I turn long-form content into high-impact videos. Focused on impact, storytelling and platform-native edits.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <AboutHero data={about.hero} />
      <FeatureGrid features={about.features} />
      <BottomCTA data={home.bottomCta} />
    </>
  );
}
