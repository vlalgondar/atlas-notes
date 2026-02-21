import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { createSpaceAction } from "./actions";

export default async function SpacesPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;            // ⬅️ await once

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: session.user.id } },
    include: { org: true },
  });
  if (!member) notFound();

  const spaces = await prisma.space.findMany({
    where: { orgId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="space-y-6">
     <header className="mb-4">
      <h1 className="text-2xl font-bold text-white">{member.org?.name ?? "Organization"}</h1>
      <p className="text-sm text-white/70">Your spaces</p>
     </header>

      <ul className="space-y-2">
        {spaces.map((s: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
          <li key={s.id} className="rounded-md border px-3 py-2">
            <a className="underline" href={`/orgs/${orgId}/spaces/${s.id}/pages`}>{s.name}</a>
          </li>
        ))}
        {spaces.length === 0 && <li className="text-zinc-500">No spaces yet.</li>}
        
      </ul>

      <form action={createSpaceAction.bind(null, orgId)} className="space-y-3">
        <input name="name" placeholder="New space name (e.g., Onboarding)"
               className="w-full rounded-md border px-3 py-2" />
        <button className="rounded-md bg-black px-4 py-2 text-white">Create space</button>
      </form>
    </main>
  );
}
