import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PagesList({
  params,
}: {
  params: Promise<{ orgId: string; spaceId: string }>;
}) {
  const { orgId, spaceId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  // ✅ membership check only (no include)
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: session.user.id } },
  });
  if (!member) notFound();

  // ✅ fetch names here (makes space.org available)
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    include: { org: true },
  });
  if (!space) notFound();

  const pages = await prisma.page.findMany({
    where: { spaceId, isArchived: false },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="space-y-4">
      <header className="space-y-2">
        <Breadcrumb
            orgId={orgId}
            orgName={space.org.name}
            spaceId={spaceId}
            spaceName={space.name}
            backHref={`/orgs/${orgId}/spaces`} // back to org’s spaces overview
            showBack={true}
        />
        <h1 className="text-2xl font-bold text-white">Pages</h1>
      </header>



      <div className="flex items-center gap-2">
        <a
            className="rounded-md border px-3 py-2 text-sm hover:bg-white/10 text-white/90 border-white/20"
            href={`/orgs/${orgId}/spaces/${spaceId}/pages/new`}
        >
            New page
        </a>
        <a
            className="rounded-md border px-3 py-2 text-sm hover:bg-white/10 text-white/90 border-white/20"
            href={`/orgs/${orgId}/spaces/${spaceId}/search`}
        >
            Search
        </a>
      </div>


      <ul className="space-y-2">
        {pages.map((p) => (
          <li key={p.id}>
            <Link className="underline" href={`/orgs/${orgId}/spaces/${spaceId}/pages/${p.id}`}>
              {p.title}
            </Link>
          </li>
        ))}
        {pages.length === 0 && <li className="text-zinc-600">No pages yet.</li>}
      </ul>
    </main>
  );
}
