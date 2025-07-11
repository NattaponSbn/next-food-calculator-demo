"use client";
import React from "react";
import { ChildItem } from "../Sidebaritems";
import { Sidebar } from "flowbite-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

interface NavItemsProps {
  item: ChildItem;
}
const NavItems: React.FC<NavItemsProps> = ({ item }) => {
  const pathname = usePathname();
  const { t } = useTranslation();

  
  // Logic การตรวจสอบ isActive ที่สมบูรณ์
  const checkIsActive = (menuUrl: string) => {
    // 1. ถ้าเป็นหน้าแรก ให้เช็คแบบตรงกันเป๊ะๆ
    if (menuUrl === '/') {
      return pathname === menuUrl;
    }
    // 2. ถ้าไม่ใช่หน้าแรก ให้เช็คว่า pathname ขึ้นต้นด้วย menuUrl
    //    และตัวอักษรตัวถัดไปต้องเป็น '/' หรือไม่มีเลย (จบพอดี)
    //    เพื่อป้องกันกรณี /abc active เมื่ออยู่ที่ /abcd
    return pathname.startsWith(menuUrl) && (pathname.length === menuUrl.length || pathname[menuUrl.length] === '/');
  };

  const isActive = checkIsActive(item.url);

  return (
    <>
      <Sidebar.Item
        href={item.url}
        as={Link}
        // ✅ 2. แก้ไข className ให้ใช้ `isActive`
        className={`${isActive
          ? "!text-white bg-primary shadow-active"
          : "text-link bg-transparent group/link"
        }`}
      >
        <span className="flex gap-3 items-center truncate">
          {item.icon ? (
            <Icon icon={item.icon} className={`${item.color}`} height={18} />
          ) : (
            // ✅ 3. แก้ไข className ของจุดแสดงสถานะให้ใช้ `isActive` ด้วย
            <span
              className={`${isActive
                ? "dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary !bg-primary h-[6px] w-[6px]"
                : "h-[6px] w-[6px] bg-darklink dark:bg-white rounded-full mx-1.5 group-hover/link:bg-primary"
              }`}
            ></span>
          )}
          <span className="max-w-36 overflow-hidden hide-menu">{t(item.nameKey!)}</span>
        </span>
      </Sidebar.Item>
    </>
  );
};

export default NavItems;
