// app/api/announcements/update/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// This function handles the PUT request to update a announcement by its ID
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
      return NextResponse.json({ message: 'Announcement ID missing' }, { status: 400 });
    }

    // Check for existence of announcement in db
    const checkAnnouncement = await db.announcement.findUnique({
      where: { id },
    });

    if (!checkAnnouncement) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    }

    const { content, endDate } = await req.json();

    // API call to update the announcement in the database
    const announcement = await db.announcement.update({
      where: { id: id },
      data: {
        content,
        endDate: new Date(endDate), // Ensure endDate is a Date object
      },
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
