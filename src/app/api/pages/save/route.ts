export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function deriveTitleFromTiptapJSON(json: any): string {
  try {
    const blocks: any[] = json?.content ?? [];
    for (const b of blocks) {
      if (b.type?.startsWith("heading")) {
        const t = (b.content ?? []).map((n: any) => n.text ?? "").join("").trim();
        if (t) return t.slice(0, 120);
      }
    }
    for (const b of blocks) {
      const t = (b.content ?? []).map((n: any) => n.text ?? "").join("").trim();
      if (t) return t.slice(0, 120);
    }
  } catch {}
  return "Untitled";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { orgId, pageId, contentJson, contentText } = body ?? {};
  if (!orgId || !pageId || !contentJson) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // auth: ensure membership
  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: session.user.id } },
  });
  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const title = deriveTitleFromTiptapJSON(contentJson);

  await prisma.page.update({
    where: { id: pageId },
    data: {
      contentJson,
      contentMd: contentText ?? "",
      title,                          // ✅ keep title in sync
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, title });
}
