// app/api/transactions/create/route.ts
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
  const body = await req.json();
  const { product, type, productId, units, price, name, label } = body;
  try {
    const button = await db.quickAddButton.create({
      data: {
        type: type,
        productId: productId,
        units: units,
        name: name,
        label: label,
        price: price,
      },
    });

    return NextResponse.json(button, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create button" },
      { status: 500 },
    );
  }
}
