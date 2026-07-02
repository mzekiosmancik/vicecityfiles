/**
 * Cloudinary delivery helpers. Assets are served from Cloudinary with
 * automatic format/quality negotiation (f_auto, q_auto) which pairs with
 * next/image for optimal LCP.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "thumb";
  quality?: "auto" | number;
}

export function cloudinaryUrl(publicId: string, options: CloudinaryOptions = {}): string {
  if (!CLOUD_NAME) return publicId;
  const { width, height, crop = "fill", quality = "auto" } = options;
  const transforms = [
    "f_auto",
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    (width || height) && `c_${crop}`,
    "dpr_auto",
  ]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

export function cloudinaryVideoUrl(publicId: string): string {
  if (!CLOUD_NAME) return publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/${publicId}`;
}
