// app/api/transactions/get/currentBatch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    // Check if user has access to this route
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get the id from the URL
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'Register ID missing' }, { status: 400 });
    }

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
      },
      where: {
        batchId: null,
        register: id
      }
    });

    return NextResponse.json({transactions})
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}