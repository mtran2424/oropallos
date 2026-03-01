import type { Metadata } from "next";
import { Montserrat, Merriweather } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/footer/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { MapProvider } from "@/components/providers/map-provider";
import { Toaster } from "react-hot-toast";
import Header from "@/components/header/Header";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: "700"
});

export const metadata: Metadata = {
  title: "Oropallo's Discount Wine and Liquor",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${montserrat.variable} ${merriweather.variable} bg-white antialiased`}
        >
          {/* <Header /> */}
          {/* <Navbar /> */}
          <Analytics />
          <SpeedInsights />
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                style: {
                  background: '#333',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#333',
                  color: '#fff',
                },
              },
              loading: {
                style: {
                  background: '#333',
                  color: '#fff',
                },
              },
            }}
          />
          <MapProvider>
            {children}
          </MapProvider>
          {/* <Footer /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
