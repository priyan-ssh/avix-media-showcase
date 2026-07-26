import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const site = useContent("site");
  const brand = (site as { brand?: string }).brand ?? "AVIIX MEDIA";
  const logoUrl = (site as { logo?: string }).logo ?? "";

  const firstWord = brand.split(" ")[0] ?? "AVIIX";
  const restWords = brand.split(" ").slice(1).join(" ") || "MEDIA";

  return (
    <Link
      to="/"
      className={cn("flex items-center gap-2 font-black tracking-widest text-white", className)}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={brand} className="h-10 sm:h-11 w-auto max-w-[220px] object-contain" />
      ) : (
        <>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Play className="h-4 w-4 fill-white text-white" />
          </span>
          <span className="text-lg">
            {firstWord}{" "}
            <span className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground align-middle">
              {restWords}
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
