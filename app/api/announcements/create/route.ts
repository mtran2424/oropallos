// app/api/announcements/create/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// This function handles the POST request to create a new announcement
export async function POST(req: NextRequest) {
  try {
    // Check for user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body to get announcement details
    const body = await req.json();
    const { content, endDate } = body;

    if (!content || !endDate) {
      return NextResponse.json({ message: 'Content and end date are required' }, { status: 400 });
    }

    // Run api call to create a new announcement in the database
    const announcement = await db.announcement.create({
      data: {
        content,
        endDate: new Date(endDate), // Ensure endDate is a Date object
      },
    });

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
