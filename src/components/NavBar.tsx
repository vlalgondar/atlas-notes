import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignInButton from "./SignInButton";

export default async function NavBar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex items-center justify-between py-4">
      <Link href="/" className="text-xl font-semibold">Atlas Notes</Link>
      <nav className="flex items-center gap-4">
        {session?.user ? (
          <>
            <span className="text-sm text-zinc-600">
              {session.user.name || session.user.email}
            </span>
            <form action="/api/auth/signout" method="post">
              <button className="rounded-md border px-3 py-1 text-sm">Sign out</button>
            </form>
          </>
        ) : (
         

          <SignInButton />

        )}
      </nav>
    </header>
  );
}
