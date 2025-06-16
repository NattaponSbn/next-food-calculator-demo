
import { Button, Dropdown } from "flowbite-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { delay } from "@/app/lib/utils";
import { useCurrentUser } from "@/app/core/hooks/use-current-user";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { user } = useCurrentUser();
  const router = useRouter(); // สร้าง instance ของ router
  const { t } = useTranslation();

  const handleLogout = async () => {
    // 1. แสดง Toast ว่ากำลังดำเนินการ (ทางเลือก แต่ช่วยให้ UX ดีขึ้น)
    const logoutToast = toast.loading('กำลังออกจากระบบ...');

    try {
      // 2. รอให้การ signOut ฝั่ง server เสร็จสิ้น
      await signOut({ redirect: false });

      // 3. เมื่อ signOut สำเร็จแล้ว จึงอัปเดต Toast และ redirect
      toast.success('ออกจากระบบเรียบร้อยแล้ว', {
        id: logoutToast, // อ้างอิงถึง Toast loading เดิมเพื่ออัปเดต
      });

      // 4. พาผู้ใช้ไปหน้า login
      router.push("/auth/login");

      // 5. Refresh เพื่อให้ server component (เช่น layout) อัปเดตสถานะ
      router.refresh();

    } catch (error) {
      // 6. กรณีเกิดข้อผิดพลาดที่ไม่คาดคิด
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ', {
        id: logoutToast,
      });
      console.error("Logout failed: ", error);
    }
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-44"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-100 hover:text-primary flex justify-center items-center cursor-pointer group-hover/menu:text-primary">
            <span className="hover:bg-lightprimary group-hover/menu:bg-lightprimary rounded-full">
              <Image
                src="/images/profile/user-1.jpg"
                alt="logo"
                height="35"
                width="35"
                className="rounded-full"
              />
            </span>
            <span className="ms-1">{ user?.name }</span>
          </span>
        )}
      >

        {/* <Dropdown.Item
          as={Link}
          href="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:user-circle-outline" height={20} />
          My Profile
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          href="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:letter-linear" height={20} />
          My Account
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          href="#"
          className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
        >
          <Icon icon="solar:checklist-linear" height={20} />
          My Task
        </Dropdown.Item> */}
        <span className="px-3 py-3">{ user?.email }</span>
        <hr className="mt-2"/>
        <div className="p-2 pt-0">
          <Button size={'sm'} onClick={handleLogout} className="w-full py-0 mt-2 border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none">Logout</Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
