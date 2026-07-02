import { NextResponse, type NextRequest } from "next/server";
import { searchAll } from "@/services/search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchAll(q);
  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
