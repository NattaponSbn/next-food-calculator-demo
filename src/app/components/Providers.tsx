"use client";

import { SessionProvider } from "next-auth/react";
import { Flowbite } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";
import { Toaster } from "react-hot-toast";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n";
import { useUIStore } from "../core/store/ui-store";
import GlobalSpinner from "./shared/global-spinner";
import { ModalProvider } from "./shared/modals/modal-provider";
import { FilterProvider } from "./shared/filters/filter-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const isLoading = useUIStore((state) => state.isLoading);
  return (
    <>
    {isLoading && <GlobalSpinner />}
    <SessionProvider>
       <I18nextProvider i18n={i18n}>
        <Toaster position="top-center" />
        <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
        <ModalProvider />
        <FilterProvider />
       </I18nextProvider>
    </SessionProvider>
    </>
   
  );
}