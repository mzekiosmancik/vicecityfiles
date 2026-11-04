/**
 * WPGraphQL queries for the Vice City Files headless WordPress backend.
 *
 * CMS model (register via CPT UI or a companion plugin):
 * - Native `posts` power News (category = News/Rumors/Updates/Trailers/Features/Guides/Analysis)
 * - Custom post types (all `show_in_graphql: true`):
 *   character, vehicle, location, weapon, mission, business, gang, easterEgg
 * - ACF field groups exposed through WPGraphQL for ACF:
 *   `wikifields` (summary, stats, image, relatedslugs)
 *   `articlefields` (rumorlevel, featured)
 * - Products come from WooCommerce via WooGraphQL.
 */

export const ARTICLE_FRAGMENT = /* GraphQL */ `
  fragment ArticleFields on Post {
    id
    slug
    title
    excerpt
    content
    date
    modified
    categories(first: 1) {
      nodes {
        name
      }
    }
    tags(first: 10) {
      nodes {
        name
      }
    }
    author {
      node {
        name
        slug
        avatar {
          url
        }
      }
    }
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    articlefields {
      rumorlevel
      featured
    }
  }
`;

export const GET_ARTICLES = /* GraphQL */ `
  ${ARTICLE_FRAGMENT}
  query GetArticles($first: Int = 12, $after: String, $category: String) {
    posts(first: $first, after: $after, where: { categoryName: $category, status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...ArticleFields
      }
    }
  }
`;

export const GET_ARTICLE_BY_SLUG = /* GraphQL */ `
  ${ARTICLE_FRAGMENT}
  query GetArticleBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...ArticleFields
      seo {
        title
        metaDesc
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`;

export const GET_ALL_ARTICLE_SLUGS = /* GraphQL */ `
  query GetAllArticleSlugs {
    posts(first: 1000, where: { status: PUBLISH }) {
      nodes {
        slug
        modified
      }
    }
  }
`;

/**
 * Media gallery — the `galery` CPT. ACF group `galeryFields`:
 *   category      select: Wallpaper | Fan Arts | Video | Video Breakdown
 *   videourl      YouTube link (Video / Video Breakdown)
 *   wallpaperurl  full-resolution file (Wallpaper)
 * Featured image = the artwork or a custom thumbnail. `wikifields.summary` is the caption;
 * `wikifields.stats` may add "Credit:" / "Artist:" and "Credit URL:" / "Artist URL:" lines.
 */
export const GET_GALERY_ITEMS = /* GraphQL */ `
  query GetGaleryItems($first: Int = 100) {
    galeries(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        title
        date
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        galeryFields {
          category
          videourl
          wallpaperurl
        }
        wikifields {
          summary
          stats
        }
      }
    }
  }
`;

/** Generic wiki CPT query — interpolate the camelCase graphql plural name. */
export const wikiEntriesQuery = (graphqlPlural: string) => /* GraphQL */ `
  query GetWikiEntries($first: Int = 50) {
    ${graphqlPlural}(first: $first) {
      nodes {
        id
        slug
        title
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        wikifields {
          summary
          stats
          relatedslugs
          image {
            node {
              sourceUrl
              altText
            }
          }
        }
        content
      }
    }
  }
`;

export const wikiEntryBySlugQuery = (graphqlSingular: string) => /* GraphQL */ `
  query GetWikiEntry($slug: ID!) {
    ${graphqlSingular}(id: $slug, idType: SLUG) {
      id
      slug
      title
      modified
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      wikifields {
        summary
        stats
        relatedslugs
        image {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

/** WooGraphQL products */
/*
 * WooGraphQL products. `price(format: RAW)` is the number we compute with; the
 * `formattedPrice` alias (FORMATTED) carries the store's currency symbol.
 */
const PRODUCT_PRICE_FIELDS = /* GraphQL */ `
  ... on SimpleProduct {
    price(format: RAW)
    regularPrice(format: RAW)
    formattedPrice: price
    stockStatus
  }
  ... on VariableProduct {
    price(format: RAW)
    formattedPrice: price
    stockStatus
    variations(first: 50) {
      nodes {
        id
        name
        price(format: RAW)
        stockStatus
      }
    }
  }
`;

export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($first: Int = 24, $category: String) {
    products(first: $first, where: { category: $category, status: "publish" }) {
      nodes {
        id
        slug
        name
        description
        shortDescription
        featured
        ${PRODUCT_PRICE_FIELDS}
        image {
          sourceUrl
          altText
        }
        galleryImages(first: 6) {
          nodes {
            sourceUrl
            altText
          }
        }
        productCategories(first: 1) {
          nodes {
            name
            slug
          }
        }
        reviewCount
        averageRating
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = /* GraphQL */ `
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      slug
      name
      description
      shortDescription
      featured
      status
      ${PRODUCT_PRICE_FIELDS}
      image {
        sourceUrl
        altText
      }
      galleryImages(first: 8) {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories(first: 1) {
        nodes {
          name
          slug
        }
      }
      reviewCount
      averageRating
      reviews(first: 10) {
        edges {
          rating
          node {
            content
            date
            author {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;

/** Store filter: product categories that have at least one product. */
export const GET_PRODUCT_CATEGORIES = /* GraphQL */ `
  query GetProductCategories {
    productCategories(first: 100, where: { hideEmpty: true }) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;

export const SEARCH_CONTENT = /* GraphQL */ `
  query SearchContent($term: String!) {
    posts(first: 10, where: { search: $term }) {
      nodes {
        slug
        title
        excerpt
      }
    }
  }
`;

/** Optional City Grid map image: a WordPress media item with the slug `city-grid-map`. */
export const GET_MAP_IMAGE = /* GraphQL */ `
  query GetMapImage {
    mediaItem(id: "city-grid-map", idType: SLUG) {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;
