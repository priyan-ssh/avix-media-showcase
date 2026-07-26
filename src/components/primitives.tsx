import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-[1200px] px-6", className)}>{children}</div>;
}

export function AccentTitle({
  parts,
  className,
}: {
  parts: { text: string; accent?: boolean }[];
  className?: string;
}) {
  return (
    <h1 className={cn("font-black leading-[0.95] tracking-tight", className)}>
      {parts.map((p, i) => (
        <span key={i} className={p.accent ? "text-primary" : "text-white"}>
          {p.text}
        </span>
      ))}
    </h1>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}
