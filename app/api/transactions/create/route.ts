// app/api/transactions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust to your prisma client path
import { currentUser } from "@clerk/nextjs/server";
import {
  calculateDiscount,
  calculateTax,
  calculateTotal,
  getDiscount,
  taxRate,
  TransactionItem,
} from "@/components/global.utils";

export async function POST(req: NextRequest) {
  // Check if user has access to route
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Retreive request and store in values
  const body = await req.json();
  const { transaction } = body;

  const liquorSubtotal = parseInt(
    transaction.transactionItems
      .reduce((sum: number, item: TransactionItem) => {
        return (
          sum + (item.type === "Liquor" ? item.itemPrice * item.quantity : 0)
        );
      }, 0)
      .toFixed(0),
  );

  const wineSubtotal = parseInt(
    transaction.transactionItems
      .reduce((sum: number, item: TransactionItem) => {
        return (
          sum +
          (item.type === "Wine"
            ? item.itemPrice *
              getDiscount(item.discount).multiplier *
              item.quantity
            : 0)
        );
      }, 0)
      .toFixed(0),
  );

  const discount = parseInt(
    calculateDiscount(transaction.transactionItems).toFixed(0),
  );

  const tax = parseInt(calculateTax(transaction.transactionItems).toFixed(0));

  const total = parseInt(
    calculateTotal(transaction.transactionItems).toFixed(0),
  );

  try {
    const res = await db.$transaction(async (tx) => {
      const trans = await tx.transaction.create({
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
          amountTendered: transaction.amountTendered,
          transactionItems: {
            create: transaction.transactionItems.map(
              (item: TransactionItem) => ({
                name: item.name,
                quantity: item.quantity,
                itemPrice: item.itemPrice,
                unitPrice: item.unitPrice,
                discount: item.discount,
                productId: item.productId ? item.productId : null,
                type: item.type,
              }),
            ),
          },
        },
        include: {
          transactionItems: true,
        },
      });

      for (const item of transaction.transactionItems) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              unitCount: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return trans;
    });

    return NextResponse.json(res, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
