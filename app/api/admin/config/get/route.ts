// app/api/admin/config/get/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// This function handles the GET request to fetch all configs
export async function GET() {
  try {
    // Check if user has access to this route
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all products from the database
    const configs = await db.config.findMany({
      select: {
        id: true,
        key: true,
        value: true,
        user: true,
      },
    });

    return NextResponse.json({ configs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
