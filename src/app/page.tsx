import { Fragment } from "react";
import { NewsTicker } from "@/components/shared/news-ticker";
import { Hero } from "@/features/home/hero";
import { WikiCategoriesSection } from "@/features/home/wiki-categories";
import { FeaturedArticles } from "@/features/home/featured-articles";
import { MapPreviewSection } from "@/features/home/map-preview";
import { CharacterSpotlight } from "@/features/home/character-spotlight";
import { MerchPreview } from "@/features/home/merch-preview";
import { MediaGallerySection } from "@/features/home/media-gallery";
import { CommunitySection } from "@/features/home/community-section";
import { INTEL_BOARD_MIN_RATED, IntelBoard, rateableArticles } from "@/features/home/intel-board";
import {
  getAllWikiEntries,
  getArticles,
  getFeaturedArticles,
  getMediaLibrary,
  getMapImage,
  getWikiEntries,
} from "@/services/wordpress";
import { getFeaturedProducts } from "@/services/woocommerce";
import { buildMapRegions } from "@/lib/map";

export const revalidate = 300; // ISR — refresh every 5 minutes

export default async function HomePage() {
  const [recentArticles, featuredArticles, characters, products, mediaLibrary, wikiEntries, mapImage] =
    await Promise.all([
      getArticles({ limit: 24 }), // same request getFeaturedArticles makes, so Next dedupes it
      getFeaturedArticles(3),
      getWikiEntries("characters"),
      getFeaturedProducts(4),
      getMediaLibrary(),
      getAllWikiEntries(),
      getMapImage(),
    ]);
  const mapRegions = buildMapRegions(wikiEntries);
  const mediaCovers = Object.fromEntries(
    Object.entries(mediaLibrary).map(([kind, { items }]) => [kind, { cover: items[0]?.image, count: items.length }]),
  ) as Parameters<typeof MediaGallerySection>[0]["library"];
  const tickerArticles = recentArticles.slice(0, 6);
  const recentWiki = [...wikiEntries]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 10);
  const showIntelBoard = rateableArticles(recentArticles).length >= INTEL_BOARD_MIN_RATED;

  // Hero headline: newest confirmed story, else the newest story of any kind.
  const top = tickerArticles.find((a) => a.rumorLevel === "confirmed") ?? tickerArticles[0];
  const heroHeadline = top
    ? { slug: top.slug, title: top.title, category: top.category, rumorLevel: top.rumorLevel }
    : null;

  // Order = priority. Launch-season news leads; evergreen reference follows.
  // Sections without data are dropped here so the "Section NN" labels stay sequential.
  const character = characters[0] ?? null;
  const sections: { key: string; render: (index: number) => React.ReactNode }[] = [
    { key: "featured", render: (i) => <FeaturedArticles articles={featuredArticles} index={i} /> },
    ...(showIntelBoard
      ? [
          {
            key: "intel",
            render: (i: number) => (
              <IntelBoard articles={recentArticles} excludeSlugs={featuredArticles.map((a) => a.slug)} index={i} />
            ),
          },
        ]
      : []),
    { key: "wiki", render: (i) => <WikiCategoriesSection index={i} recent={recentWiki} /> },
    ...(mapRegions.length
      ? [{ key: "map", render: (i: number) => <MapPreviewSection index={i} regions={mapRegions} mapImage={mapImage} /> }]
      : []),
    ...(character
      ? [{ key: "character", render: (i: number) => <CharacterSpotlight character={character} index={i} /> }]
      : []),
    ...(products.length
      ? [{ key: "merch", render: (i: number) => <MerchPreview products={products} index={i} /> }]
      : []),
    { key: "media", render: (i) => <MediaGallerySection library={mediaCovers} index={i} /> },
    { key: "community", render: (i) => <CommunitySection index={i} /> },
  ];

  return (
    <>
      {/* Hero + launch countdown (Case File 001) */}
      <Hero headline={heroHeadline} />
      {/* Breaking news ticker */}
      <NewsTicker articles={tickerArticles} />
      {/* Numbered sections start at 02 — the hero is file 01 */}
      {sections.map((section, i) => (
        <Fragment key={section.key}>{section.render(i + 2)}</Fragment>
      ))}
    </>
  );
}
