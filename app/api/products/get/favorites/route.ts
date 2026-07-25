// app/api/products/get/favorites/route.ts
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
        abv: true,
        size: true,
        upc: true,
        createdAt: true,
        itemType: true,
      },
      where: {
        favorite: true,
        hidden: false,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
