import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const search       = searchParams.get("search");
    const featured     = searchParams.get("featured");

    const items = await prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        ...(featured === "true" ? { isFeatured: true } : {}),
        ...(search
          ? { OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ]}
          : {}),
      },
      include: { category: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
