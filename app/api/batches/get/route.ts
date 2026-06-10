// app/api/batches/get/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Check if user has access to this route
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const batches = await db.batch.findMany({
      select: {
        id: true,
        wineGross: true,
        liquorGross: true,
        gross: true,
        tax: true,
        void: true,
        cashTotal: true,
        creditTotal: true,
        date: true,
        discount: true,
        register: true,
        transactions: {
          select: {
            id: true,
            status: true,
            batchId: true,
            register: true,
            notes: true,
            createdAt: true,
            wineSubtotal: true,
            liquorSubtotal: true,
            discount: true,
            tax: true,
            taxRate: true,
            total: true,
            cash: true,
            credit: true,
            transactionItems: {
              select: {
                id: true,
                name: true,
                quantity: true,
                itemPrice: true,
                productId: true,
                discount: true,
                type: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ batches });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error },
      { status: 500 },
    );
  }
}
