// app/api/products/get/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// This function handles the GET request to fetch all products
export async function GET() {
  try {
    // Fetch all products from the database
    const discounts = await db.discount.findMany({
      select: {
        id: true,
        name: true,
        value: true,
        multiplier: true,
      }
    });

    return NextResponse.json({ discounts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
