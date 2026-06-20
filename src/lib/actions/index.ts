"use server";

import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// ─── Reservation Actions ───────────────────────────────────────────────────

const reservationSchema = z.object({
  tableId:    z.string().min(1),
  guestName:  z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  guestCount: z.number().min(1).max(20),
  date:       z.string(),
  timeSlot:   z.string(),
  notes:      z.string().optional(),
});

export async function createReservation(data: z.infer<typeof reservationSchema>) {
  try {
    const session = await auth();
    const parsed  = reservationSchema.parse(data);

    const table = await prisma.restaurantTable.findUnique({ where: { id: parsed.tableId } });
    if (!table) return { success: false, error: "Table not found." };
    if (table.status === "OCCUPIED" || table.status === "RESERVED") {
      return { success: false, error: "Table is no longer available." };
    }
    if (table.capacity < parsed.guestCount) {
      return { success: false, error: "Table capacity too small for your party." };
    }

    const reservation = await prisma.reservation.create({
      data: {
        tableId:    parsed.tableId,
        guestName:  parsed.guestName,
        guestEmail: parsed.guestEmail,
        guestPhone: parsed.guestPhone,
        guestCount: parsed.guestCount,
        date:       new Date(parsed.date),
        timeSlot:   parsed.timeSlot,
        notes:      parsed.notes,
        userId:     session?.user?.id,
        totalAmount: table.pricePerSeat * parsed.guestCount,
      },
    });

    await prisma.restaurantTable.update({
      where: { id: parsed.tableId },
      data:  { status: "RESERVED" },
    });

    revalidatePath("/reservation");
    return { success: true, data: { id: reservation.id, confirmCode: reservation.confirmCode } };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: "Invalid form data." };
    console.error("createReservation error:", err);
    return { success: false, error: "Failed to create reservation." };
  }
}

export async function cancelReservation(reservationId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: "Unauthorized." };

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) return { success: false, error: "Reservation not found." };

    const isAdmin = (session.user as { role?: string }).role === "ADMIN";
    if (!isAdmin && reservation.userId !== session.user.id) {
      return { success: false, error: "Not authorized to cancel this reservation." };
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data:  { status: "CANCELLED" },
    });

    await prisma.restaurantTable.update({
      where: { id: reservation.tableId },
      data:  { status: "AVAILABLE" },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("cancelReservation error:", err);
    return { success: false, error: "Failed to cancel reservation." };
  }
}

// ─── Order Actions ─────────────────────────────────────────────────────────

const orderSchema = z.object({
  type:    z.enum(["delivery", "pickup"]),
  address: z.string().optional(),
  phone:   z.string().optional(),
  notes:   z.string().optional(),
  items: z.array(z.object({
    menuItemId: z.string(),
    quantity:   z.number().min(1),
    price:      z.number().min(0),
    notes:      z.string().optional(),
  })).min(1),
});

export async function createOrder(data: z.infer<typeof orderSchema>) {
  try {
    const session = await auth();
    const parsed  = orderSchema.parse(data);

    const totalAmount = parsed.items.reduce((s, i) => s + i.price * i.quantity, 0);

    const order = await prisma.order.create({
      data: {
        type:        parsed.type,
        address:     parsed.address,
        phone:       parsed.phone,
        notes:       parsed.notes,
        userId:      session?.user?.id,
        totalAmount,
        orderItems: {
          create: parsed.items.map(i => ({
            menuItemId: i.menuItemId,
            quantity:   i.quantity,
            price:      i.price,
            notes:      i.notes,
          })),
        },
      },
      include: { orderItems: true },
    });

    return { success: true, data: { id: order.id } };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: "Invalid order data." };
    console.error("createOrder error:", err);
    return { success: false, error: "Failed to place order." };
  }
}

// ─── Admin Table Actions ───────────────────────────────────────────────────

const tableSchema = z.object({
  number:      z.number().min(1),
  zone:        z.enum(["INDOOR","OUTDOOR","TERRACE","BAR","PRIVATE"]),
  capacity:    z.number().min(1).max(30),
  posX:        z.number(),
  posY:        z.number(),
  shape:       z.enum(["round","rect"]),
  pricePerSeat: z.number().min(0),
});

export async function addTable(data: z.infer<typeof tableSchema>) {
  try {
    const session = await auth();
    if ((session?.user as { role?: string })?.role !== "ADMIN") {
      return { success: false, error: "Admin only." };
    }
    const parsed = tableSchema.parse(data);
    const table  = await prisma.restaurantTable.create({ data: parsed });
    revalidatePath("/admin");
    revalidatePath("/reservation");
    return { success: true, data: table };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: "Invalid table data." };
    console.error("addTable error:", err);
    return { success: false, error: "Failed to add table." };
  }
}

export async function deleteTable(tableId: string) {
  try {
    const session = await auth();
    if ((session?.user as { role?: string })?.role !== "ADMIN") {
      return { success: false, error: "Admin only." };
    }
    await prisma.restaurantTable.update({
      where: { id: tableId },
      data:  { isActive: false },
    });
    revalidatePath("/admin");
    revalidatePath("/reservation");
    return { success: true };
  } catch (err) {
    console.error("deleteTable error:", err);
    return { success: false, error: "Failed to delete table." };
  }
}

export async function updateTableStatus(
  tableId: string,
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE"
) {
  try {
    const session = await auth();
    if ((session?.user as { role?: string })?.role !== "ADMIN") {
      return { success: false, error: "Admin only." };
    }
    await prisma.restaurantTable.update({ where: { id: tableId }, data: { status } });
    revalidatePath("/admin");
    revalidatePath("/reservation");
    return { success: true };
  } catch (err) {
    console.error("updateTableStatus error:", err);
    return { success: false, error: "Failed to update table." };
  }
}

// ─── Newsletter Action ─────────────────────────────────────────────────────

export async function subscribeNewsletter(email: string) {
  try {
    z.string().email().parse(email);
    // In production: integrate with Mailchimp/Resend/SendGrid
    console.log(`Newsletter subscription: ${email}`);
    return { success: true, message: "Subscribed successfully!" };
  } catch {
    return { success: false, error: "Invalid email address." };
  }
}

// ─── Contact Action ────────────────────────────────────────────────────────

const contactSchema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export async function sendContactMessage(data: z.infer<typeof contactSchema>) {
  try {
    const parsed = contactSchema.parse(data);
    // In production: send via Resend/Nodemailer
    console.log("Contact message received:", parsed);
    return { success: true, message: "Message sent! We will respond within 24 hours." };
  } catch (err) {
    if (err instanceof z.ZodError) return { success: false, error: "Invalid form data." };
    return { success: false, error: "Failed to send message." };
  }
}

// ─── Admin Blog Actions ────────────────────────────────────────────────────

export async function toggleBlogPost(postId: string, published: boolean) {
  try {
    const session = await auth();
    if ((session?.user as { role?: string })?.role !== "ADMIN") {
      return { success: false, error: "Admin only." };
    }
    await prisma.blogPost.update({
      where: { id: postId },
      data:  { isPublished: published, publishedAt: published ? new Date() : null },
    });
    revalidatePath("/admin");
    revalidatePath("/blog");
    return { success: true };
  } catch (err) {
    console.error("toggleBlogPost error:", err);
    return { success: false, error: "Failed to update post." };
  }
}
