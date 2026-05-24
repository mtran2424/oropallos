// app/api/products/get/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth, currentUser } from '@clerk/nextjs/server';

// This function handles the GET request to fetch all products
export async function GET() {
  try {
    // Check if user has access to this route
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        hidden: true,
        unitPrice: true,
        unitCount: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
