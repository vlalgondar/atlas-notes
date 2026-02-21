import { prisma } from "@/lib/prisma";

export type SearchHit = {
  id: string;
  title: string;
  snippet: string;
};

export async function searchPagesInSpace(
  spaceId: string,
  q: string,
  limit = 20
): Promise<SearchHit[]> {
  const rows = await prisma.$queryRawUnsafe<
    Array<{ id: string; title: string; snippet: string }>
  >(
    `
    SELECT
      p.id,
      p.title,
      ts_headline(
        'english',
        coalesce(p."contentMd", ''),
        websearch_to_tsquery('english', $2),
        'ShortWord=2, MaxFragments=2, MinWords=5, MaxWords=18, HighlightAll=FALSE, StartSel=<mark>, StopSel=</mark>'
      ) AS snippet
    FROM "Page" p
    WHERE p."spaceId" = $1
      AND p."isArchived" = FALSE
      AND p.search_tsv @@ websearch_to_tsquery('english', $2)
    ORDER BY ts_rank_cd(
      p.search_tsv,
      websearch_to_tsquery('english', $2)
    ) DESC, p."updatedAt" DESC
    LIMIT $3::int
    `,
    spaceId,
    q,
    limit
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title ?? "Untitled",
    snippet: r.snippet ?? "",
  }));
}
