import { useState, useEffect } from "react";

/**
 * Extracts the most highlighted vibrant color from an image URL using HTML5 Canvas.
 * Falls back gracefully to defaultGlow if CORS or loading fails.
 */
export function useImageGlowColor(
  src: string | undefined, 
  defaultGlow: string = "rgb(222, 27, 36)"
): string {
  const [glowColor, setGlowColor] = useState<string>(defaultGlow);

  useEffect(() => {
    if (!src || typeof window === "undefined") {
      setGlowColor(defaultGlow);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 24;
        canvas.height = 24;
        ctx.drawImage(img, 0, 0, 24, 24);

        const imageData = ctx.getImageData(0, 0, 24, 24).data;
        let totalR = 0, totalG = 0, totalB = 0;
        let count = 0;

        let maxVibrantR = 0, maxVibrantG = 0, maxVibrantB = 0;
        let maxSaturation = -1;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          if (a < 128) continue; // Skip transparent pixels

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const lum = (max + min) / 2;
          const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * (lum / 255) - 1));

          // Look for medium luminance and maximum saturation (most highlighted vibrant color)
          if (lum > 25 && lum < 235 && sat > maxSaturation) {
            maxSaturation = sat;
            maxVibrantR = r;
            maxVibrantG = g;
            maxVibrantB = b;
          }

          totalR += r;
          totalG += g;
          totalB += b;
          count++;
        }

        // If we found a vibrant highlighted color, use it! Otherwise fallback to average color
        if (maxSaturation > 0.15 && maxVibrantR + maxVibrantG + maxVibrantB > 50) {
          setGlowColor(`rgb(${maxVibrantR}, ${maxVibrantG}, ${maxVibrantB})`);
        } else if (count > 0) {
          const avgR = Math.round(totalR / count);
          const avgG = Math.round(totalG / count);
          const avgB = Math.round(totalB / count);
          setGlowColor(`rgb(${avgR}, ${avgG}, ${avgB})`);
        }
      } catch (e) {
        setGlowColor(defaultGlow);
      }
    };

    img.onerror = () => {
      setGlowColor(defaultGlow);
    };
  }, [src, defaultGlow]);

  return glowColor;
}
