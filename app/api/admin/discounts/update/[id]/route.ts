// app/api/admin/products/update/hidden/[id]/route.ts
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
      return NextResponse.json({ message: 'Discount ID missing' }, { status: 400 });
    }

    const { name, label, value, multiplier } = await req.json();

    // API call to update the product in the database
    const button = await db.discount.update({
      where: { id: id },
      data: {
        name: name,
        label: label,
        value: value,
        multiplier: multiplier
      },
    });

    return NextResponse.json({ button });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
