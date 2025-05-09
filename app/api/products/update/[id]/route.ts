// app/api/products/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// This function handles the PUT request to update a product by its ID
export async function PUT(req: NextRequest) {
  try {
    // Check if user has access to this route
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get the id from the URL
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'Product ID missing' }, { status: 400 });
    }

    // Check for existence of product in db
    const checkProduct = await db.product.findUnique({
      where: { id },
    });

    if (!checkProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const { name, description, price, category, subcategory, type } = await req.json();

    // API call to update the product in the database
    const product = await db.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price,
        category,
        subcategory,
        type
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
