import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-2 font-black tracking-widest text-white",
        className,
      )}
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary">
        <Play className="h-4 w-4 fill-white text-white" />
      </span>
      <span className="text-lg">
        AVIIX <span className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground align-middle">MEDIA</span>
      </span>
    </Link>
  );
}
