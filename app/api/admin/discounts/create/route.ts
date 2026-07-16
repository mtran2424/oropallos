// app/api/admin/discount/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust to your prisma client path
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  // Check if user has access to route
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Retreive request and store in values
  const { label, name, value, multiplier } = await req.json();
  try {
    const discount = await db.discount.create({
      data: {
        label,
        name,
        value,
        multiplier
      },
    });

    return NextResponse.json(discount, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create discount" },
      { status: 500 },
    );
  }
}
