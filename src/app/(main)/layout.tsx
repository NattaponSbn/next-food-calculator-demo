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
        <div className="body-wrapper w-full bg-white dark:bg-darkgray">
          <Header />
          {/* Body Content  */}
          <main className="flex-grow">
            <div className="bg-lightgray mr-3 rounded-page min-h-[70vh] dark:bg-gray-900">
              <div
                className={`container mx-auto py-30`}
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

