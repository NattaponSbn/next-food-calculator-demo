"use client";
import React, { useState, useEffect } from "react";
import { Badge, Button, Navbar } from "flowbite-react";
import { Icon } from "@iconify/react";
import Profile from "./Profile";
import Notification from "./notification";
import FullLogo from "../../shared/logo/FullLogo";
import { Drawer } from "flowbite-react";
import MobileSidebar from "../sidebar/MobileSidebar";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { ThemeToggleButton } from "./ThemeToggleButton";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // mobile-sidebar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  return (
     <>
      {/* --- [แก้ไข] Header หลัก --- */}
      <header
        // ใช้ class พื้นฐาน และเพิ่ม class sticky แบบมีเงื่อนไข
        className={`app-header ${isSticky ? "app-header-sticky bg-white/80 dark:bg-gray-800/80" : "bg-white dark:bg-gray-800/80"}`}
      >
        <Navbar
          fluid
          // ทำให้ Navbar โปร่งใสเสมอ เพื่อให้สีพื้นหลังมาจาก <header>
          className="bg-transparent dark:bg-transparent py-2 sm:px-6 px-4"
        >
          <div className="flex items-center justify-between w-full">
            
            {/* --- ส่วนซ้าย: Mobile Toggle --- */}
            <div className="flex items-center">
              <button onClick={() => setIsOpen(true)} className="mobile-toggle-btn">
                <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
              </button>
              {/* Notification Icon (ถ้ามี) */}
            </div>

            {/* --- ส่วนขวา: Actions --- */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="version-text hidden sm:block">
                {t('system.version')}: {process.env.NEXT_PUBLIC_APP_VERSION}
              </div>
              <ThemeToggleButton />
              <LanguageSwitcher />
              <Profile />
            </div>
            
          </div>
        </Navbar>
      </header>

      {/* --- Mobile Sidebar (Drawer) --- */}
      <Drawer open={isOpen} onClose={handleClose} className="w-72">
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          {/* ควรจะ import MobileSidebar Component มาใช้ที่นี่ */}
          <MobileSidebar />
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;
