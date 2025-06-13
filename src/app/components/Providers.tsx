"use client";

import { SessionProvider } from "next-auth/react";
import { Flowbite } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
      <Toaster position="top-center" />
    </SessionProvider>
  );
}