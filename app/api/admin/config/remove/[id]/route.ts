import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// This function runs call to server the remove product from db
export async function DELETE(req: NextRequest) {
  try {
    // Check if user has access to this route
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
    const config = await db.config.findUnique({
      where: { id },
    });

    if (!config) {
      return NextResponse.json({ message: 'Config not found' }, { status: 404 });
    }

    // Delete if announcement is in db
    await db.config.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Config deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
