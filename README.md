This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Tailwind, React, Prisma backend, Clerk auth.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment
Must include DATABASE_URL variable linked to database server. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY from Clerk for backend auth operations. CLOUDINARY_URL, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_UPLOAD_PRESET, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET from Cloudinary for photo upload and hosting. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY for Google Maps API. NEXT_PUBLIC_SITE_URL must be URL hosting backend API (cannot be cross-site).

Before running development server:

```bash
# if haven't set up yet
npx prisma init
# generate ORM for backend
npx prisma generate
# set ORM
npx prisma db push
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
