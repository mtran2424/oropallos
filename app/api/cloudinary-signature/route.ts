import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import { auth } from '@clerk/nextjs/server';

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  // Check for user
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'oropallos';

  const paramsToSign = {
    timestamp: timestamp,
    upload_preset: 'ml_default',
    folder: folder,
  };

  const signature = cloudinary.v2.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    uploadPreset: 'ml_default',
    folder: folder,
  });
}
