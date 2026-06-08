// app/api/admin/config/create/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// This function handles the POST request to create a new product
export async function POST(req: NextRequest) {
  try {
    // Check for user
    const currUser = await currentUser();

    if (!currUser || currUser.username !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body to get product details
    const body = await req.json();
    const { key, value, user } = body.config;
    if (!key || !value || !user) {
      return NextResponse.json({ message: `Key, value, andd user are required` }, { status: 400 });
    }

    // Run api call to create a new product in the database
    const config = await db.config.create({
      data: {
        value,
        user,
        key,
      },
    });

    return NextResponse.json({ config }, { status: 201 });
  } catch (error) {
    console.error('Error creating config:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
