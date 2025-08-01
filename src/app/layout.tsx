import React from "react";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import 'simplebar-react/dist/simplebar.min.css';
import { ThemeModeScript } from "flowbite-react";
import "./css/globals.css";
import { niramit } from "@/utils/fonts";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Providers from "./components/Providers";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Food Calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={niramit.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <ThemeModeScript />
      </head>
      <body className={`${manrope.className}`}>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}