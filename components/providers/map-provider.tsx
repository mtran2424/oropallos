// app/map-provider.tsx
"use client";
import { LoadScript } from "@react-google-maps/api";

export const MapProvider = ({ children }: { children: React.ReactNode }) => (
  <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
    {children}
  </LoadScript>
);
