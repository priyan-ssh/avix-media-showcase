import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/primitives";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClips } from "@/hooks/useContent";
import { InstagramReelModal } from "@/components/InstagramReelModal";

const accentClass: Record<string, string> = {
  red: "text-primary",
  yellow: "text-yellow-400",
  green: "text-green-400",
};

const ringClass: Record<string, string> = {
  red: "shadow-[0_0_60px_-15px_rgba(222,27,36,0.6)] border-primary/40",
  yellow: "shadow-[0_0_60px_-15px_rgba(250,204,21,0.5)] border-yellow-500/40",
  green: "shadow-[0_0_60px_-15px_rgba(74,222,128,0.5)] border-green-500/40",
};

export const Route = createFileRoute("/clips")({
  head: () => ({
    meta: [
      { title: "All Clips — Aviix Media" },
      {
        name: "description",
        content:
          "Browse the full library of short-form clips edited by Aviix Media — podcast highlights, viral moments, and creator content.",
      },
      { property: "og:title", content: "All Clips — Aviix Media" },
      {
        property: "og:description",
        content: "Full library of short-form clips edited by Aviix Media.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClipsPage,
});

function ClipsPage() {
  const clips = useClips();
  const [selectedReel, setSelectedReel] = useState<string | null>(null);
  
  return (
    <section className="border-b border-border bg-background">
      <Container className="py-16 md:py-24">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            All Clips
          </span>
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-black uppercase text-white">
          Every clip, in one place.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          A growing library of short-form edits crafted for retention and reach.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clips.map((clip) => {
            const ac = (clip.accent_color as string) ?? "red";
            return (
              <div key={clip.id}>
                <div
                  onClick={() => {
                    if (clip.image && clip.image.includes("instagram.com")) {
                      setSelectedReel(clip.image);
                    }
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:scale-[1.02]",
                    clip.image && clip.image.includes("instagram.com") && "cursor-pointer",
                    ringClass[ac] ?? ringClass.red,
                  )}
                >
                  <MediaPlaceholder
                    src={clip.image}
                    alt={clip.title}
                    aspect="9/16"
                    className="rounded-none border-0"
                  />
                </div>

                {(clip as any).show_details !== false && (clip.brand || clip.title || clip.views) ? (
                  <div className="mt-3.5 flex flex-col gap-1 px-1">
                    {clip.brand && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {clip.brand}
                      </span>
                    )}
                    {(clip.title || clip.title_accent) && (
                      <div className="text-base font-black uppercase leading-tight text-white">
                        {clip.title} {clip.title_accent && <span className={accentClass[ac] ?? accentClass.red}>{clip.title_accent}</span>}
                      </div>
                    )}
                    {clip.views && (
                      <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                        <Play className="h-3 w-3 fill-primary text-primary" />
                        {clip.views}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
      <InstagramReelModal
        isOpen={!!selectedReel}
        onClose={() => setSelectedReel(null)}
        reelUrl={selectedReel}
      />
    </section>
  );
}
