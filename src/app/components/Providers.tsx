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
import { usePathname } from "next/navigation";
import { publicRoutes } from "@/config/auth-routes";
import { AuthGuard } from "./auth/auth-guard";

const AppCoreProviders = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <Toaster position="top-center" />
     <Flowbite theme={{ theme: customTheme }}>
        {children}
      </Flowbite>

    <ModalProvider />
    <FilterProvider />
  </I18nextProvider>
);


const Providers = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoading = useUIStore((state) => state.isLoading);

  // ตรวจสอบว่า Path ปัจจุบันเป็นหน้า Private หรือไม่
  const isPrivateRoute = !publicRoutes.includes(pathname);

  return (
    <>
      {isLoading && <GlobalSpinner />}
      <SessionProvider>
        {isPrivateRoute ? (
          <AuthGuard>
            <AppCoreProviders>{children}</AppCoreProviders>
          </AuthGuard>
        ) : (
          <AppCoreProviders>{children}</AppCoreProviders>
        )}
      </SessionProvider>
    </>
  );
};

export default Providers;