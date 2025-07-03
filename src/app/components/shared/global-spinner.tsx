// components/GlobalSpinner.tsx
"use client";

import { Spinner } from 'flowbite-react';
import React from 'react';

const GlobalSpinner = () => {
 return (
    // Container หลักที่ทำให้ Spinner อยู่กลางหน้าจอและมีพื้นหลังทึบยังคงเหมือนเดิม
    <div
      className="
        fixed inset-0 z-50 
        flex items-center justify-center 
        bg-black bg-opacity-50 
        transition-opacity duration-300
      "
      aria-label="Loading..."
      role="alert"
      aria-busy="true"
    >
      {/* 2. แทนที่ div เดิมด้วย Spinner Component */}
      <Spinner
        aria-label="Loading application content"
        size="xl" // สามารถปรับขนาดได้: 'xs', 'sm', 'md', 'lg', 'xl'
        color="info" // สามารถเปลี่ยนสีได้: 'failure', 'gray', 'info', 'pink', 'purple', 'success', 'warning'
      />
    </div>
  );
};

export default GlobalSpinner;