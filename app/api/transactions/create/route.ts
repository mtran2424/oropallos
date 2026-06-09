// app/api/transactions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust to your prisma client path
import { currentUser } from "@clerk/nextjs/server";
import { getDiscount, taxRate, TransactionItem } from "@/components/global.utils";

export async function POST(req: NextRequest) {
  // Check if user has access to route
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Retreive request and store in values
  const body = await req.json();
  const { transaction } = body;

  const liquorSubtotal = transaction.transactionItems.reduce((sum: number, item: TransactionItem) => {
    return sum + (item.type === "Liquor" ? item.itemPrice * item.quantity : 0);
  }, 0);

  const wineSubtotal = transaction.transactionItems.reduce((sum: number, item: TransactionItem) => {
    return sum + (item.type === "Wine" ? item.itemPrice * getDiscount(item.discount).multiplier * item.quantity : 0);
  }, 0);

  const discount = transaction.transactionItems.reduce((sum: number, item: TransactionItem) => {
    return sum + (item.type === "Wine" && getDiscount(item.discount).value !== "No_Discount" ? (item.itemPrice * (1 - getDiscount(item.discount).multiplier) * item.quantity) : 0);
  }, 0);

  const tax = (liquorSubtotal + wineSubtotal) * (taxRate / 100);

  const total = liquorSubtotal + wineSubtotal + tax;

  try {
    const trans = await db.transaction.create({
      data: {
        status: transaction.status,
        register: transaction.register,
        liquorSubtotal: liquorSubtotal,
        wineSubtotal: wineSubtotal,
        discount: discount,
        tax: tax,
        total: total,
        taxRate: taxRate,
        cash: transaction.cash,
        credit: transaction.credit,
        notes: transaction.notes,
        transactionItems: {
          create: transaction.transactionItems.map((item: TransactionItem) => ({
            name: item.name,
            quantity: item.quantity,
            itemPrice: item.itemPrice,
            discount: item.discount,
            productId: item.productId ? item.productId : null,
            type: item.type
          })),
        },
      },
      include: {
        transactionItems: true,
      },
    });

    return NextResponse.json(trans, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
