// components/shared/FilterProvider.tsx
'use client';

import { useFilter } from '@/app/core/hooks/use-filter';
import { useRef, useEffect } from 'react';

// 1. [แก้ไข] Import hook และ utilities จาก @floating-ui/react
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useDismiss,
  useInteractions,
  FloatingPortal, // 2. (แนะนำ) Import FloatingPortal เพื่อ render นอก DOM tree หลัก
} from '@floating-ui/react';

export const FilterProvider = () => {
  // การดึง state จาก store ยังคงเหมือนเดิม
  const { useFilterStore } = useFilter();
  const { isOpen, content, anchorElement, close } = useFilterStore();

  // 3. สร้าง ref สำหรับลูกศร
  const arrowRef = useRef(null);

  // 4. [แก้ไข] เรียกใช้ useFloating hook (หัวใจหลัก)
  const { refs, floatingStyles, context, middlewareData } = useFloating({
    // Element ที่จะให้ Popup ไปเกาะ (จะถูก set ผ่าน useEffect)
    elements: {
      reference: anchorElement,
    },
    open: isOpen, // ควบคุมการแสดงผลจาก state ของเรา
    onOpenChange: (open) => {
      // เมื่อ Floating UI บอกว่าควรจะปิด (เช่น กด Esc) ให้เรียก close() ของเรา
      if (!open) {
        close();
      }
    },
    placement: 'bottom-start', // ตำแหน่ง
    // whileElementsMounted จะคอยอัปเดตตำแหน่งอัตโนมัติเมื่อ scroll หรือ resize
    whileElementsMounted: autoUpdate,
    // Middleware คือ plugin ที่เพิ่มความสามารถต่างๆ
    middleware: [
      offset(10),       // ระยะห่างจาก anchor 10px
      flip(),           // พลิกตำแหน่ง (เช่น จาก bottom เป็น top) เมื่อพื้นที่ไม่พอ
      shift({ padding: 8 }), // ขยับเพื่อให้อยู่ในขอบเขตหน้าจอเสมอ (เว้นระยะ 8px)
      arrow({ element: arrowRef }), // จัดการตำแหน่งของลูกศร
    ],
  });

  // 5. [เพิ่มใหม่] จัดการ Interactions (ทำให้ปิดได้เมื่อคลิกข้างนอกหรือกด Esc)
  const dismiss = useDismiss(context, {
    // ปิดเมื่อคลิกนอกพื้นที่ (แต่ไม่ต้องปิดเมื่อคลิกที่ anchor)
    outsidePressEvent: 'mousedown',
    referencePress: false, 
  });
  
  const { getReferenceProps, getFloatingProps } = useInteractions([
    dismiss,
  ]);

  // 6. [สำคัญ] เราต้องคอยบอก Floating UI ว่า anchorElement ของเราคืออะไร
  // เพราะมันมาจาก state และอาจจะเปลี่ยนแปลงได้
  useEffect(() => {
    if (anchorElement) {
      refs.setReference(anchorElement);
    }
  }, [refs, anchorElement]);


  if (!isOpen) return null;

  return (
    // 7. [แนะนำ] ใช้ FloatingPortal เพื่อให้แน่ใจว่า z-index ทำงานถูกต้อง
    // มันจะ render Popup ไปที่ท้ายของ <body>
    <FloatingPortal>
      <div
        ref={refs.setFloating} // ผูก ref ของ Floating UI เข้ากับ div หลักของ Popup
        style={floatingStyles}  // ใช้ style ที่คำนวณมาให้
        {...getFloatingProps()} // ใส่ props ของ interaction
        className="z-50"
      >
        <div className="rounded-lg border bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {content}
        </div>
        
        {/* ลูกศร (Arrow) */}
        <div
          ref={arrowRef}
          className="popper-arrow" // ใช้ class เดิมได้
          style={{
            // Style สำหรับลูกศร จะถูกคำนวณและใส่เข้ามาใน middlewareData
            position: 'absolute',
            left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : '',
            top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : '',
          }}
        />
      </div>
    </FloatingPortal>
  );
};