// app/api/products/get/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// This function handles the GET request to fetch all products
export async function GET() {
  try {
    // Fetch all products from the database
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        subcategory: true,
        type: true,
        imageUrl: true,
        favorite: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
