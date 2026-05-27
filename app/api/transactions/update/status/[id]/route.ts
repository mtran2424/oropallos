// app/api/transactions/update/status/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// This function handles the PUT request to update a product by its ID
export async function PUT(req: NextRequest) {
  try {
    // Check if user has access to this route
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the id from the URL
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'Transaction ID missing' }, { status: 400 });
    }

    // Check for existence of transaction in db
    const checkTransaction = await db.transaction.findUnique({
      where: { id },
    });

    if (!checkTransaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    const { status } = await req.json();

    // API call to update the transaction in the database
    const transaction = await db.transaction.update({
      where: { id: id },
      data: {
        status: status
      },
    });

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
