// src/app/onboarding/actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createOrgAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Not signed in (no user id in session). Please sign out and sign in again.");
  }

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Organization name is required");

  const org = await prisma.organization.create({ data: { name } });

  await prisma.orgMember.create({
    data: { orgId: org.id, userId: session.user.id, role: "owner" },
  });

  redirect(`/orgs/${org.id}/spaces`);
}
