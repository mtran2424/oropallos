// app/api/products/add/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// This function handles the POST request to create a new product
export async function POST(req: NextRequest) {
  try {
    // Check for user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body to get product details
    const body = await req.json();
    const { name, description, price, category, subcategory, type } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ message: 'Name, price, and category are required' }, { status: 400 });
    }

    // Run api call to create a new product in the database
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        category,
        subcategory,
        type,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
