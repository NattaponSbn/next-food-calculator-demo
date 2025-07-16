"use client";

import React from "react";
import { Sidebar } from "flowbite-react";
import SidebarContent from "./Sidebaritems";
import NavItems from "./NavItems";
import NavCollapse from "./NavCollapse";
import SimpleBar from "simplebar-react";
import FullLogo from "../../shared/logo/FullLogo";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const SidebarLayout = () => {
  const { t } = useTranslation();
  return (
     <>
      {/* ซ่อนบนจอเล็กกว่า xl, และแสดงเป็น block */}
      <div className="hidden xl:block">
        <div className="flex">
          <Sidebar
            // ✅ ใช้ Custom Class
            className="app-sidebar menu-sidebar"
            aria-label="Main Sidebar"
          >
            <div className="sidebar-logo-container">
              <FullLogo />
            </div>

            <SimpleBar className="sidebar-scrollbar">
              <Sidebar.Items className="px-6">
                <Sidebar.ItemGroup className="space-y-2"> {/* เพิ่ม space-y เพื่อระยะห่าง */}
                  {SidebarContent.map((item, index) => (
                    <div key={index} className="menu-group">
                      
                      {/* --- Heading (ถ้ามี) --- */}
                      {item.headingKey && (
                        <div className="px-3 pt-4 pb-2"> {/* เพิ่ม Padding ให้ heading */}
                          <h5 className="sidebar-heading">
                            <span className="hide-menu">{t(item.headingKey)}</span>
                          </h5>
                        </div>
                      )}
                      
                      {/* --- Menu Items --- */}
                      {item.children?.map((child) => (
                        <React.Fragment key={child.id}>
                          {child.children ? (
                            <NavCollapse item={child} />
                          ) : (
                            <NavItems item={child} />
                          )}
                        </React.Fragment>
                      ))}

                      {/* --- Separator Icon (Optional, แสดงท้ายกลุ่มที่ไม่ใช่กลุ่มสุดท้าย) --- */}
                      {index < SidebarContent.length - 1 && (
                         <Icon
                           icon="solar:menu-dots-bold"
                           className="sidebar-separator-icon hide-icon"
                           height={18}
                         />
                      )}

                    </div>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </SimpleBar>
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
