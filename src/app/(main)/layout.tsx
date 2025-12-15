"use client";
import React from "react";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";
import Footer from "./layout/vertical/footer/Footer";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-h-screen">
      <div className="page-wrapper flex w-full">
        {/* Header/sidebar */}
        <Sidebar />
        <div className="body-wrapper flex-1 min-w-0 bg-white dark:bg-darkgray">
          <Header />
          {/* Body Content  */}
          <main className="flex-grow">
            <div className="bg-lightgray mr-3 rounded-page min-h-[82vh] dark:bg-gray-900">
              <div
                className={`container mx-auto pt-5 pb-5`}
              >
                {children}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

