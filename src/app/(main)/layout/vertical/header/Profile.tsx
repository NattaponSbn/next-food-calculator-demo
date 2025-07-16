
import { Button, Dropdown } from "flowbite-react";
import React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { useCurrentUser } from "@/app/core/hooks/use-current-user";
import { useTranslation } from "react-i18next";

const ProfileSkeleton = () => {
  return (
    <div className="flex items-center animate-pulse h-10">
      <div className="w-9 h-9 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      <div className="w-24 h-4 bg-gray-300 rounded ms-2 dark:bg-gray-700"></div>
    </div>
  );
};

const Profile = () => {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter(); // สร้าง instance ของ router
  const { t } = useTranslation();

  if(isLoading) {
     return <ProfileSkeleton />;
  }

  const handleLogout = async () => {
    // 1. แสดง Toast ว่ากำลังดำเนินการ (ทางเลือก แต่ช่วยให้ UX ดีขึ้น)
    const logoutToast = toast.loading('กำลังออกจากระบบ...');

    try {
      // 2. รอให้การ signOut ฝั่ง server เสร็จสิ้น
      await signOut({ redirect: false });

        // 4. พาผู้ใช้ไปหน้า login
      router.push("/auth/login");

    

      // 3. เมื่อ signOut สำเร็จแล้ว จึงอัปเดต Toast และ redirect
      toast.success('ออกจากระบบเรียบร้อยแล้ว', {
        id: logoutToast, // อ้างอิงถึง Toast loading เดิมเพื่ออัปเดต
      });

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
          // ✅ ใช้ Custom Class ที่สร้างขึ้น
          <span className="profile-dropdown-trigger dark:text-gray-300 hover:text-primary group-hover/menu:text-primary">
            <span className="profile-dropdown-avatar dark:hover:bg-gray-700 group-hover/menu:bg-lightprimary">
              <Image
                src="/images/profile/user-1.jpg"
                alt="logo"
                height="35"
                width="35"
                className="rounded-full"
              />
            </span>
            <span>{ user?.name }</span>
          </span>
        )}
      >
        <span className="px-4 py-3 text-sm text-gray-900 dark:text-white">{ user?.email }</span>
        <hr className="my-2 border-ld"/> {/* ใช้ class ที่สร้างไว้แล้ว */}
        <div className="p-2 pt-0">
          <Button 
            size={'sm'} 
            onClick={handleLogout} 
            // ✅ ใช้ Custom Class สำหรับปุ่ม Logout
            className="btn-logout hover:bg-lightprimary dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/50 outline-none focus:outline-none focus:ring-0"
          >
            {t('button.logout')}
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
