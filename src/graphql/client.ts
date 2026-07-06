/**
 * Minimal, dependency-free WPGraphQL client with Next.js fetch caching.
 * Every request is tagged so content can be revalidated on-demand from
 * a WordPress webhook (`/api/revalidate`).
 */

const ENDPOINT = process.env.WORDPRESS_GRAPHQL_ENDPOINT;

export class GraphQLError extends Error {
  constructor(message: string, public readonly errors?: unknown[]) {
    super(message);
    this.name = "GraphQLError";
  }
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  { tags = ["wordpress"], revalidate = 300 }: { tags?: string[]; revalidate?: number | false } = {},
): Promise<T | null> {
  if (!ENDPOINT) return null;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { tags, revalidate },
    });

    if (!res.ok) throw new GraphQLError(`WPGraphQL responded ${res.status}`);

    const json = (await res.json()) as { data?: T; errors?: unknown[] };
    if (json.errors?.length) {
      throw new GraphQLError(
        `WPGraphQL returned errors: ${JSON.stringify(json.errors)}`,
        json.errors,
      );
    }

    return json.data ?? null;
  } catch (error) {
    // CMS down or unconfigured → callers fall back to mock content.
    console.error("[wpgraphql]", error instanceof Error ? error.message : error);
    return null;
  }
}
