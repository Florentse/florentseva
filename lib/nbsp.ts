// Glues short function words (articles, conjunctions, pronouns, short
// prepositions) to the word that follows them with a non-breaking space, so
// they never end up dangling alone at the end of a line — e.g. "I" or "и".
const SHORT_WORDS = [
  // English
  "a", "an", "the",
  "i", "we", "you", "he", "she", "it", "they", "us", "our", "my", "your", "his", "her", "its", "their",
  "in", "on", "at", "to", "of", "for", "by", "up", "as", "or", "if", "so", "no", "but", "nor", "yet", "and",
  "is", "am", "are", "was", "were", "with", "from", "that", "this",
  // Russian
  "в", "во", "с", "со", "к", "ко", "у", "о", "об", "обо", "от", "ото", "до", "из", "изо",
  "за", "на", "по", "под", "подо", "над", "надо", "при", "про", "для", "без", "безо",
  "через", "чрез", "между", "меж",
  "и", "а", "но", "или", "иль", "либо", "да", "чтобы", "что", "как", "так", "же", "ли", "бы", "не", "ни",
  "я", "ты", "он", "она", "оно", "мы", "вы", "они",
];

const SHORT_WORDS_PATTERN = new RegExp(
  `(?<=^|[\\s(«"' ])(${SHORT_WORDS.join("|")}) (?=\\S)`,
  "giu",
);

// Preserves null/undefined so it's safe to use directly on optional
// metadata fields (title/description) without turning "unset" into "".
export function nbsp<T extends string | null | undefined>(text: T): T {
  if (text == null) return text;
  return text.replace(SHORT_WORDS_PATTERN, (match) => match.slice(0, -1) + " ") as T;
}

// Technical fields that are never prose — skipped so we don't waste cycles
// running the regex over ids/slugs/refs that can never match it anyway.
const SKIP_KEYS = new Set(["_id", "_key", "_type", "_ref", "current"]);

// Recursively applies nbsp() to every string in a fetched Sanity result,
// so a single wrap around client.fetch() covers all of a query's text.
export function nbspDeep<T>(value: T): T {
  if (typeof value === "string") {
    return nbsp(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => nbspDeep(item)) as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = SKIP_KEYS.has(key) ? val : nbspDeep(val);
    }
    return result as T;
  }
  return value;
}
