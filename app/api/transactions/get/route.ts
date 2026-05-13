// app/api/transactions/get/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    // Check if user has access to this route
    // const { userId } = await auth();

    // if (!userId) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const transactions = await db.transaction.findMany({
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
        cash: true,
        credit: true,
        taxRate: true,
        total: true,
        transactionItems: {
          select: {
            id: true,
            name: true,
            quantity: true,
            unitPrice: true,
            discount: true,
            type: true,
          }
        }
      }
    });

    return NextResponse.json({transactions})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}