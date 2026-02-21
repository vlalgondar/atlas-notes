import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/Editor";
import Breadcrumb from "@/components/Breadcrumb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PageEditor({
  params,
}: {
  params: Promise<{ orgId: string; spaceId: string; pageId: string }>;
}) {
  const { orgId, spaceId, pageId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: session.user.id } },
  });
  if (!member) notFound();

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) notFound();

  // 🔽 fetch space+org for breadcrumb
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    include: { org: true },
  });
  if (!space) notFound();

  return (
    <main className="space-y-4">
      <header className="space-y-2">
        <Breadcrumb
            orgId={orgId}
            orgName={space.org.name}
            spaceId={spaceId}
            spaceName={space.name}
            backHref={`/orgs/${orgId}/spaces/${spaceId}/pages`} // back to this space’s pages list
            showBack={true}
        />
        <h1 className="text-2xl font-bold text-white">{page.title}</h1>
      </header>


      <Editor initialJson={page.contentJson} orgId={orgId} pageId={pageId} />
    </main>
  );
}
