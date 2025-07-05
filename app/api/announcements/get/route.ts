// app/api/announcements/get/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// This function handles the GET request to fetch all announcements
export async function GET() {
  try {
    // Fetch all announcements from the database
    const announcements = await db.announcement.findMany({
      select: {
        id: true,
        content: true,
        endDate: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
