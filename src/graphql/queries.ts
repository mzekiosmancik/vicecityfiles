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

/** Homepage media gallery — sourced from the `galery` CPT. */
export const GET_GALERY_ITEMS = /* GraphQL */ `
  query GetGaleryItems($first: Int = 12) {
    galeries(first: $first, where: { status: PUBLISH }) {
      nodes {
        id
        title
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
export const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts($first: Int = 24, $category: String) {
    products(first: $first, where: { category: $category, status: "publish" }) {
      nodes {
        id
        slug
        name
        description
        ... on SimpleProduct {
          price(format: RAW)
          regularPrice(format: RAW)
          stockStatus
        }
        ... on VariableProduct {
          price(format: RAW)
          stockStatus
          variations(first: 20) {
            nodes {
              id
              name
              price(format: RAW)
            }
          }
        }
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
      ... on SimpleProduct {
        price(format: RAW)
        regularPrice(format: RAW)
        stockStatus
      }
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
        }
      }
      reviewCount
      averageRating
      reviews(first: 10) {
        nodes {
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
