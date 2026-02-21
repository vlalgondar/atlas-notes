import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { searchPagesInSpace } from "@/lib/search";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SpaceSearch({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string; spaceId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { orgId, spaceId } = await params;
  const { q = "" } = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: session.user.id } },
  });
  if (!member) notFound();

  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    include: { org: true },
  });
  if (!space) notFound();

  const hits = q.trim() ? await searchPagesInSpace(spaceId, q.trim(), 30) : [];

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <Breadcrumb
          orgId={orgId}
          orgName={space.org.name}
          spaceId={spaceId}
          spaceName={space.name}
          backHref={`/orgs/${orgId}/spaces/${spaceId}/pages`}
          showBack={true}
        />
        <h1 className="text-2xl font-bold text-white">Search</h1>
      </header>

      <form
        action=""
        className="flex gap-2"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="Search this space…"
          className="w-full rounded-md border border-white/15 bg-white/10 px-3 py-2 text-white placeholder-white/50"
        />
        <button className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-white/90 hover:bg-white/15">
          Search
        </button>
      </form>

      {q && (
        <p className="text-sm text-white/60">
          {hits.length} result{hits.length === 1 ? "" : "s"} for <span className="text-white">“{q}”</span>
        </p>
      )}

      <ul className="space-y-4">
        {hits.map((h) => (
          <li key={h.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <Link
              href={`/orgs/${orgId}/spaces/${spaceId}/pages/${h.id}`}
              className="text-white font-semibold hover:underline"
            >
              {h.title}
            </Link>
            <p
              className="mt-1 text-white/80"
              dangerouslySetInnerHTML={{ __html: h.snippet || "" }}
            />
          </li>
        ))}
        {q && hits.length === 0 && (
          <li className="text-white/70">No results. Try different keywords.</li>
        )}
      </ul>
    </main>
  );
}
