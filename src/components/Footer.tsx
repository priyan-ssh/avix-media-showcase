import { Instagram, Youtube, Linkedin } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { Logo } from "./Logo";

const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function Footer() {
  const site = useContent("site");
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-6 md:grid-cols-3">
        <Logo />
        <p className="hidden md:block text-center text-xs text-muted-foreground">
          {site.footer.copyright}
        </p>
        <div className="flex items-center justify-end gap-3">
          {site.footer.socials.map((s) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            if (!Icon) return null;
            return (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary hover:text-white"
                aria-label={s.icon}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
        <p className="md:hidden col-span-2 text-xs text-muted-foreground">
          {site.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
