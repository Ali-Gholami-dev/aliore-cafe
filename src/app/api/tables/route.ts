import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const tables = await prisma.restaurantTable.findMany({
      where:   { isActive: true },
      include: { _count: { select: { reservations: true } } },
      orderBy: { number: "asc" },
    });
    return NextResponse.json(tables);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if ((session?.user as { role?: string })?.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }
    const body  = await req.json();
    const table = await prisma.restaurantTable.create({ data: body });
    return NextResponse.json(table, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
