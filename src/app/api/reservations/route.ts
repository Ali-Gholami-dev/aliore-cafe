import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  tableId:    z.string(),
  guestName:  z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  guestCount: z.number().min(1).max(20),
  date:       z.string(),
  timeSlot:   z.string(),
  notes:      z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isAdmin = (session.user as { role?: string }).role === "ADMIN";
    const reservations = await prisma.reservation.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: { table: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(reservations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const data = schema.parse(body);

    const reservation = await prisma.reservation.create({
      data: {
        ...data,
        date:       new Date(data.date),
        userId:     session?.user?.id,
        totalAmount: 0,
      },
    });

    // Update table status
    await prisma.restaurantTable.update({
      where: { id: data.tableId },
      data: { status: "RESERVED" },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
