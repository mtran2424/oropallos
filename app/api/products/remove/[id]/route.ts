import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// This function runs call to server the remove product from db
export async function DELETE(req: NextRequest) {
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
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Delete if product is in db
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
