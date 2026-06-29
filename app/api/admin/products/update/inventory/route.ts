// app/api/admin/products/update/inventory
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust to your prisma client path
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  // Check if user has access to route
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Retreive request and store in values
  const body = await req.json();
  const { order } = body;

  try {
    const res = await db.$transaction(async (tx) => {
      for (const item of order.orderItems) {
        if (item.product) {
          const totalCount = (item.unitType === "Unit" ?
            item.quantity :
            (item.product.unitsPerCase ?
              item.product.unitsPerCase * item.quantity : 0));

          await tx.product.update({
            where: { id: item.product.id },
            data: {
              unitCount: {
                increment: totalCount,
              },
            },
          });
        }
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create inventory" },
      { status: 500 },
    );
  }
}
