"use client";
import React from "react";
import Sidebar from "./layout/vertical/sidebar/Sidebar";
import Header from "./layout/vertical/header/Header";
import { Toaster } from 'react-hot-toast';
import { niramit } from "./../../utils/fonts";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex w-full min-h-screen ${niramit.variable}`}>
      <div className="page-wrapper flex w-full">
        {/* Header/sidebar */}
        <Sidebar />
        <div className="body-wrapper w-full bg-white dark:bg-dark">
          <Header />
          {/* Body Content  */}
          <Toaster position="top-center" /> 
          <div className="bg-lightgray mr-3 rounded-page min-h-[90vh]">
            <div
              className={`container mx-auto  py-30`}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
