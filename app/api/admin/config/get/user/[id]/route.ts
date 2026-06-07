// app/api/admin/config/get/user/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// This function handles the GET request to return all configs for a user
export async function GET(req: NextRequest) {
  try {
    // Get the id from the URL
    const id = req.nextUrl.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ message: 'User missing' }, { status: 400 });
    }

    // Check for existence of config in db
    const configs = await db.config.findMany({
      where: { user: id },
    });

    if (!configs) {
      return NextResponse.json({ message: 'Configs not found' }, { status: 404 });
    }

    return NextResponse.json({ configs });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
