// app/api/transactions/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust to your prisma client path
import { currentUser } from "@clerk/nextjs/server";
import {
  calculateDiscount,
  calculateSubtotal,
  calculateTotal,
  taxRate,
  TransactionItemRequest,
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

  const liquorSubtotal = calculateSubtotal(transaction.transactionItems.filter((item: TransactionItemRequest) => item.type === "Liquor"));
  const wineSubtotal = calculateSubtotal(transaction.transactionItems.filter((item: TransactionItemRequest) => item.type === "Wine"));

  const discount = calculateDiscount(transaction.transactionItems.filter((item: TransactionItemRequest) => item.discount.value !== "No_Discount" && item.discount.value !== "Tax_Free"));

  const tax = (liquorSubtotal + wineSubtotal) * (taxRate / 100);

  const total = calculateTotal(transaction.transactionItems.filter((item: TransactionItemRequest) => item.type !== "Giftcard"));

  const giftcardTotal = calculateTotal(transaction.transactionItems.filter((item: TransactionItemRequest) => item.type === "Giftcard"))

  try {
    const res = await db.$transaction(async (tx) => {
      const trans = await tx.transaction.create({
        data: {
          status: transaction.status,
          register: transaction.register,
          liquorSubtotal: parseInt(liquorSubtotal.toFixed(0)),
          wineSubtotal: parseInt(wineSubtotal.toFixed(0)),
          discount:  parseInt(discount.toFixed(0)),
          tax: tax,
          total: parseInt(total.toFixed(0)),
          taxRate: taxRate,
          cash: transaction.cash - giftcardTotal,
          credit: transaction.credit,
          notes: transaction.notes,
          amountTendered: transaction.amountTendered,
          transactionItems: {
            create: transaction.transactionItems.map(
              (item: TransactionItemRequest) => ({
                name: item.name,
                quantity: item.quantity,
                itemPrice: item.itemPrice,
                unitPrice: item.unitPrice,
                discount: item.discount.value,
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
