import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Atlas Notes",
  description: "Team Knowledge Base with Local-AI Semantic Search",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <Providers>
          <div className="mx-auto max-w-4xl p-6">
            <NavBar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
