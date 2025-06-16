"use client";

import { SessionProvider } from "next-auth/react";
import { Flowbite } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
       <I18nextProvider i18n={i18n}>
        <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
        <Toaster position="top-center" />
       </I18nextProvider>
      
    </SessionProvider>
  );
}