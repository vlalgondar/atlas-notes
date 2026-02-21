import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOrgAction } from "./actions";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Create your first Organization</h1>
      <form action={createOrgAction} className="space-y-3">
        <input name="name" placeholder="Organization name (e.g., Acme)"
               className="w-full rounded-md border px-3 py-2" />
        <button className="rounded-md bg-black px-4 py-2 text-white">Create</button>
      </form>
    </main>
  );
}
