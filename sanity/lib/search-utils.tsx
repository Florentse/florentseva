import { Fragment, type ReactNode } from "react";

const MAX_HINTS = 8;

// ─── Fuzzy matching ──────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        i === 0
          ? j
          : a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function fuzzyMatch(query: string, word: string): boolean {
  const q = query.toLowerCase();
  const w = word.toLowerCase();
  if (w.includes(q)) return true;
  if (q.length >= 4) {
    const threshold = q.length <= 5 ? 1 : 2;
    if (levenshtein(q, w.slice(0, q.length)) <= threshold) return true;
  }
  return false;
}

export function cleanWord(token: string): string {
  return token.replace(/[^a-zA-Za-яёА-ЯЁ]/g, "").toLowerCase();
}

// ─── Hints ───────────────────────────────────────────────────────────────────

export function buildHints(query: string, texts: string[]): string[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const seen = new Set<string>();
  const hints: string[] = [];

  texts.forEach((text) => {
    if (!text) return;
    const tokens = text.match(/[^\s]+/g) || [];

    tokens.forEach((rawToken, i) => {
      const clean = cleanWord(rawToken);
      if (!clean || !fuzzyMatch(q, clean)) return;

      if (!seen.has(clean)) {
        seen.add(clean);
        hints.push(clean);
      }

      if (tokens[i + 1]) {
        const w2 = clean + " " + cleanWord(tokens[i + 1]);
        if (!seen.has(w2)) {
          seen.add(w2);
          hints.push(w2);
        }
      }

      if (tokens[i + 1] && tokens[i + 2]) {
        const w3 = clean + " " + cleanWord(tokens[i + 1]) + " " + cleanWord(tokens[i + 2]);
        if (!seen.has(w3)) {
          seen.add(w3);
          hints.push(w3);
        }
      }
    });
  });

  return hints.slice(0, MAX_HINTS);
}

// ─── Filtering ───────────────────────────────────────────────────────────────

export function matchesSearch(query: string, texts: string[]): boolean {
  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const tokens = texts
    .join(" ")
    .match(/[^\s]+/g)
    ?.map(cleanWord) ?? [];

  return queryWords.some((qw) => tokens.some((tw) => tw && fuzzyMatch(qw, tw)));
}

// ─── Highlighting ────────────────────────────────────────────────────────────

export function highlightText(text: string, queryWords: string[]): ReactNode {
  if (!text || queryWords.length === 0) return text;

  const parts = text.split(/(\s+)/);

  return parts.map((part, i) => {
    if (!part.trim()) return part;
    const clean = cleanWord(part);
    const isMatch = clean && queryWords.some((qw) => fuzzyMatch(qw, clean));
    return isMatch ? (
      <mark key={i} className="search-highlight">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    );
  });
}