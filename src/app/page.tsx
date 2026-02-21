import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SignInButton from "@/components/SignInButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const membership = await prisma.orgMember.findFirst({
      where: { userId: session.user.id },
      include: { org: true },
    });
    if (!membership) redirect("/onboarding");
    redirect(`/orgs/${membership.orgId}/spaces`);
  }

  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Atlas Notes</h1>
      <p className="text-zinc-700">Private wiki + local semantic search. Sign in to get started.</p>
      <SignInButton />
    </main>
  );
}
