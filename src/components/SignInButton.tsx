// src/components/SignInButton.tsx
"use client";
import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/" })}
      className="rounded-md border px-3 py-1 text-sm"
    >
      Sign in with GitHub
    </button>
  );
}
