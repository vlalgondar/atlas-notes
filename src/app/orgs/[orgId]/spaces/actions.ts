"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createSpaceAction(orgId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not signed in");

  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: session.user.id } },
  });
  if (!member) throw new Error("Not an org member");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Space name is required");

  await prisma.space.create({ data: { orgId, name } });
  redirect(`/orgs/${orgId}/spaces`);
}

