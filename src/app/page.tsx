import { NewsTicker } from "@/components/shared/news-ticker";
import { Hero } from "@/features/home/hero";
import { WikiCategoriesSection } from "@/features/home/wiki-categories";
import { FeaturedArticles } from "@/features/home/featured-articles";
import { MapPreviewSection } from "@/features/home/map-preview";
import { CharacterSpotlight } from "@/features/home/character-spotlight";
import { MerchPreview } from "@/features/home/merch-preview";
import { MediaGallerySection } from "@/features/home/media-gallery";
import { CommunitySection } from "@/features/home/community-section";
import { getArticles, getFeaturedArticles, getWikiEntries } from "@/services/wordpress";
import { getFeaturedProducts } from "@/services/woocommerce";

export const revalidate = 300; // ISR — refresh every 5 minutes

export default async function HomePage() {
  const [tickerArticles, featuredArticles, characters, products] = await Promise.all([
    getArticles({ limit: 6 }),
    getFeaturedArticles(3),
    getWikiEntries("characters"),
    getFeaturedProducts(4),
  ]);

  return (
    <>
      {/* 1. Hero */}
      <Hero />
      {/* 2. Breaking news ticker */}
      <NewsTicker articles={tickerArticles} />
      {/* 3. Wiki categories */}
      <WikiCategoriesSection />
      {/* 4. Featured articles */}
      <FeaturedArticles articles={featuredArticles} />
      {/* 5. Map preview */}
      <MapPreviewSection />
      {/* 6. Character spotlight */}
      <CharacterSpotlight character={characters[0] ?? null} />
      {/* 7. Merch preview */}
      <MerchPreview products={products} />
      {/* 8. Media gallery */}
      <MediaGallerySection />
      {/* 9. Community + newsletter */}
      <CommunitySection />
    </>
  );
}
