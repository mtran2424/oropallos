// app/api/admin/config/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// This function handles the PUT request to update a announcement by its ID
export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the id from the URL
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'Config ID missing' }, { status: 400 });
    }

    // Check for existence of config in db
    const checkConfig = await db.config.findUnique({
      where: { id },
    });

    if (!checkConfig) {
      return NextResponse.json({ message: 'Config not found' }, { status: 404 });
    }

    const { key, value } = await req.json();

    // API call to update the announcement in the database
    const config = await db.config.update({
      where: { id: id },
      data: {
        key,
        value
      },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
