import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where:   { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
