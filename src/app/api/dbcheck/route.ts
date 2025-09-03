import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';       
export const dynamic = 'force-dynamic';

export async function GET() {
  
  const org = await prisma.organization.create({ data: { name: 'HealthCheck' } });
  const found = await prisma.organization.findUnique({ where: { id: org.id } });
  await prisma.organization.delete({ where: { id: org.id } });

  
  const ext = await prisma.$queryRaw<
    Array<{ extname: string }>
  >`SELECT extname FROM pg_extension WHERE extname = 'vector'`;

  return NextResponse.json({
    prismaOk: !!found,
    pgvector: ext.length > 0,
  });
}
