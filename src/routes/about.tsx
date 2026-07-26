import { createFileRoute } from "@tanstack/react-router";
import { AboutHero } from "@/components/AboutHero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { BottomCTA } from "@/components/BottomCTA";
import { useContent } from "@/hooks/useContent";

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
  const about = useContent("about");
  const home = useContent("home");
  return (
    <>
      <AboutHero data={about.hero} />
      <FeatureGrid features={about.features} />
      <BottomCTA data={home.bottomCta} />
    </>
  );
}
