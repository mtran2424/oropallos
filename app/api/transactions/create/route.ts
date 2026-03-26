// app/api/transactions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust to your prisma client path
import { auth } from "@clerk/nextjs/server";
import { getDiscount, taxRate, TransactionItem } from "@/components/global.utils";

export async function POST(req: NextRequest) {
  // Check if user has access to route
  const { userId } = await auth();

  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Retreive request and store in values
  const body = await req.json();
  const { items } = body;

  const liquorSubtotal = items.reduce((sum: number, item: TransactionItem) => {
    return sum + (item.type === "Liquor" ? item.unitPrice * item.quantity : 0);
  }, 0);

  const wineSubtotal = items.reduce((sum: number, item: TransactionItem) => {
    return sum + (item.type === "Wine" ? item.unitPrice * getDiscount(item.discount).multiplier * item.quantity : 0);
  }, 0);
  
  const discount = items.reduce((sum: number, item: TransactionItem) => {
    return sum + item.type === "Liquor" ? (item.unitPrice * item.quantity) - (item.unitPrice * getDiscount(item.discount).multiplier * item.quantity) : 0;
  }, 0);

  const tax = (liquorSubtotal + wineSubtotal) * (taxRate/100);

  const total = liquorSubtotal + wineSubtotal + tax;

  try {
    const transaction = await db.transaction.create({
      data: {
        status: "Cashed",
        register: "Register 1",
        liquorSubtotal: liquorSubtotal,
        wineSubtotal: wineSubtotal,
        discount: discount,
        tax: tax,
        total: total,
        taxRate: taxRate,
        transactionItems: {
          create: items.map((item: TransactionItem) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: "No_Discount",
            type: item.type
          })),
        },
      },
      include: {
        transactionItems: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
