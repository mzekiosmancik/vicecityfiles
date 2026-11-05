/*
 * WordPress sends titles, excerpts and content as HTML, with typographic characters
 * escaped as entities ("&#8217;" for ’, "&hellip;" for …, "&quot;" for "). React renders
 * strings literally, so these must be decoded to real characters before display.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  laquo: "«",
  raquo: "»",
  prime: "′",
  Prime: "″",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  deg: "°",
  times: "×",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
};

function fromCodePoint(code: number, fallback: string): string {
  try {
    return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : fallback;
  } catch {
    return fallback;
  }
}

/** Decodes named (&hellip;), decimal (&#8217;) and hex (&#x2019;) entities. Unknown ones are left as-is. */
export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const hex = body[1] === "x" || body[1] === "X";
      return fromCodePoint(parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10), match);
    }
    return NAMED_ENTITIES[body] ?? match;
  });
}

/** HTML → plain text: drops tags, then decodes entities. Line breaks are kept. */
export function htmlToText(html?: string | null): string {
  return decodeEntities((html ?? "").replace(/<[^>]+>/g, "")).trim();
}
