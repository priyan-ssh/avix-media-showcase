import { cn } from "@/lib/utils";

export function MediaPlaceholder({
  src,
  alt,
  aspect = "16/9",
  className,
  label,
}: {
  src?: string;
  alt: string;
  aspect?: string;
  className?: string;
  label?: string;
}) {
  if (src) {
    const isVideo = /\.(mp4|webm|mov|m4v|ogg|qt|mkv|avi)(\?|#|$)/i.test(src);
    if (isVideo) {
      return (
        <video
          src={src}
          className={cn("w-full h-full object-cover rounded-lg bg-black", className)}
          style={{ aspectRatio: aspect }}
          controls
          playsInline
          muted
          loop
          autoPlay
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover rounded-lg", className)}
        style={{ aspectRatio: aspect }}
      />
    );
  }
  return (
    <div
      className={cn(
        "w-full rounded-lg border border-border bg-card relative overflow-hidden",
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
