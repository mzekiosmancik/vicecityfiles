import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

const GRADIENTS = {
  pink: "from-neon-pink/60 via-neon-purple/40 to-vice-black",
  blue: "from-neon-blue/50 via-neon-purple/30 to-vice-black",
  purple: "from-neon-purple/60 via-neon-pink/30 to-vice-black",
  orange: "from-neon-orange/60 via-neon-pink/40 to-vice-black",
} as const;

interface MediaImageProps {
  image: ImageAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders the CMS/Cloudinary image when available; otherwise a neon
 * gradient placeholder with palm-silhouette texture (no copyrighted assets).
 */
export function MediaImage({ image, className, sizes, priority }: MediaImageProps) {
  if (image.url) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  const gradient = GRADIENTS[image.placeholder ?? "purple"];
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn("vhs-overlay relative overflow-hidden bg-gradient-to-br", gradient, className)}
    >
      {/* skyline silhouette */}
      <svg
        viewBox="0 0 200 100"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-2/3 w-full text-black/50"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 100V62h8V48h6v14h10V40h8v22h6V52h10v10h8V30h6v32h12V44h8v18h10V36h6v26h10V56h8v6h8V26h8v36h10V50h8v12h10V42h8v20h6V58h10v42Z"
        />
        <g fill="currentColor" opacity="0.8">
          <path d="M30 62c-6-8-14-10-14-10s8-1 12 3c-1-6 2-12 2-12s2 7 2 12c4-4 12-3 12-3s-8 2-14 10Z" />
          <path d="M150 58c-5-7-12-9-12-9s7-1 10 2c-1-5 2-10 2-10s2 6 2 10c3-3 10-2 10-2s-7 2-12 9Z" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-vice-black/70 via-transparent to-transparent" />
    </div>
  );
}
