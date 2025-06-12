
import { Button, Dropdown } from "flowbite-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
const Profile = () => {
  
  const router = useRouter(); // สร้าง instance ของ router

  const handleLogout = async () => {
    await signOut({ redirect: false });
    // หลังจาก logout สำเร็จ คุณสามารถทำอย่างอื่นต่อได้ที่นี่
    // เช่น แสดง modal หรืออัปเดต state ใน UI
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="rounded-sm w-44"
        dismissOnClick={false}
        renderTrigger={() => (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <Image
              src="/images/profile/user-1.jpg"
              alt="logo"
              height="35"
              width="35"
              className="rounded-full"
            />
          </span>
        )}
      >

        <Dropdown.Item
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
        </Dropdown.Item>
        <div className="p-3 pt-0">
        <Button size={'sm'} onClick={handleLogout} className="mt-2 border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none">Logout</Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
