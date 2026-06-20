import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity:   z.number().min(1),
  price:      z.number().min(0),
  notes:      z.string().optional(),
});

const orderSchema = z.object({
  type:    z.enum(["delivery", "pickup"]).default("delivery"),
  address: z.string().optional(),
  phone:   z.string().optional(),
  notes:   z.string().optional(),
  items:   z.array(orderItemSchema).min(1),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isAdmin = (session.user as { role?: string }).role === "ADMIN";
    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: session.user.id },
      include: { orderItems: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, ...rest } = orderSchema.parse(body);

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        ...rest,
        userId: session?.user?.id,
        totalAmount,
        orderItems: {
          create: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity:   i.quantity,
            price:      i.price,
            notes:      i.notes,
          })),
        },
      },
      include: { orderItems: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", issues: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
