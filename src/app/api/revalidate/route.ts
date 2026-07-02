import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand ISR revalidation, called by WordPress webhooks
 * (e.g. WP Webhooks plugin on post save/update).
 *
 * POST /api/revalidate
 * Header: x-revalidation-secret: <REVALIDATION_SECRET>
 * Body: { "tags": ["articles", "article:some-slug"] }
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATION_SECRET;
  const provided = request.headers.get("x-revalidation-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { tags?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const tags = (body.tags ?? ["wordpress"]).filter((t) => typeof t === "string").slice(0, 20);
  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({ revalidated: tags, now: Date.now() });
}
