// app/api/transactions/create/route.ts
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Check if user has access to route
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const body = await req.json();
  const { batch } = body;

  try {
    const bat = await db.batch.create({
      data: {
        wineGross: batch.wineGross,
        liquorGross: batch.liquorGross,
        gross: batch.gross,
        tax: batch.tax,
        void: batch.void,
        cashTotal: batch.cashTotal,
        creditTotal: batch.creditTotal,
        register: batch.register,
        discount: batch.discount,
        transactions: {
          connect: batch.transactions.map((transaction: { id: string | undefined }) => ({
            id: transaction.id,
            register: batch.register,
          })),
        }
      },
      include: {
        transactions: true,
      },
    });

    return NextResponse.json(bat, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}