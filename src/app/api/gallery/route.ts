import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const images = await prisma.galleryImage.findMany({
      where: {
        isActive: true,
        ...(category && category !== "all" ? { category } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(images);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
