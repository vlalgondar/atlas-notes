import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function NewPage({
  params,
}: {
  params: Promise<{ orgId: string; spaceId: string }>;
}) {
  const { orgId, spaceId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  // ensure membership
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: session.user.id } },
  });
  if (!member) redirect(`/orgs/${orgId}/spaces`);

  const page = await prisma.page.create({
    data: {
      spaceId,
      title: "Untitled",
      slug: crypto.randomUUID(),
      authorId: session.user.id,
      contentJson: { type: "doc", content: [] },
      contentMd: "",
    },
  });

  redirect(`/orgs/${orgId}/spaces/${spaceId}/pages/${page.id}`);
}
