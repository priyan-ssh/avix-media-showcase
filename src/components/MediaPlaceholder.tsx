import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function MediaPlaceholder({
  src,
  alt,
  aspect = "16/9",
  className,
  label,
  priority = false,
}: {
  src?: string;
  alt: string;
  aspect?: string;
  className?: string;
  label?: string;
  priority?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  if (src && !hasError) {
    const isVideo = /\.(mp4|webm|mov|m4v|ogg|qt|mkv|avi)(\?|#|$)/i.test(src);

    if (isVideo) {
      return (
        <div className={cn("relative overflow-hidden rounded-lg bg-black", className)} style={{ aspectRatio: aspect }}>
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 animate-pulse flex items-center justify-center z-10 pointer-events-none">
              <div className="h-6 w-6 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
            </div>
          )}
          <video
            src={src}
            className={cn("w-full h-full object-cover rounded-none transition-opacity duration-500", isLoading ? "opacity-0" : "opacity-100")}
            onLoadedData={() => setIsLoading(false)}
            onError={() => { setIsLoading(false); setHasError(true); }}
            controls
            playsInline
            muted
            loop
            autoPlay
          />
        </div>
      );
    }

    return (
      <div className={cn("relative overflow-hidden rounded-lg bg-zinc-950", className)} style={{ aspectRatio: aspect }}>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-950 animate-pulse flex items-center justify-center z-10 pointer-events-none">
            <div className="h-6 w-6 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn(
            "w-full h-full object-cover rounded-none transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-lg border-0 bg-card relative overflow-hidden",
        "bg-[radial-gradient(circle_at_30%_20%,rgba(222,27,36,0.12),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05),transparent_60%)]",
        className,
      )}
      style={{ aspectRatio: aspect }}
      aria-label={alt}
      role="img"
    >
      {label && (
        <span className="absolute bottom-3 right-4 text-[10px] tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

