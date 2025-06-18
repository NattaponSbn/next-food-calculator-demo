// components/GlobalSpinner.tsx
"use client";

import React from 'react';

const GlobalSpinner = () => {
  return (
    // 1. Container หลัก: ครอบทั้งหน้าจอและอยู่บนสุด
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
      {/* 2. ตัว Spinner: วงกลมหมุนๆ */}
      <div 
        className="
          h-16 w-16 
          animate-spin 
          rounded-full 
          border-4 border-solid border-white border-t-transparent
        "
      ></div>
    </div>
  );
};

export default GlobalSpinner;