// src/app/components/shared/auth/AuthGuard.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Spinner } from 'flowbite-react'; // ตัวอย่าง Spinner

// Loader Component
const FullScreenLoader = ({ title }: { title: string }) => {
  // --- [เพิ่ม] ใช้ useEffect ที่นี่เพื่อตั้ง Title ---
  // การตั้ง title ใน component ลูก จะทำให้มันทำงานได้ถูกต้องตามลำดับการ render
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Spinner aria-label="Loading application" size="xl" />
    </div>
  );
};

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { status } = useSession();
  const router = useRouter();
  
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    // ถ้าการโหลด session เสร็จสิ้นแล้ว (ไม่ได้ loading) และไม่พบ user
    if (!isLoading && !isAuthenticated) {
      // Redirect ไปหน้า login
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // 1. ถ้ายังอยู่ในสถานะ 'loading', ให้แสดงหน้าจอ Loading เต็มรูปแบบ
  if (isLoading) {
    return <FullScreenLoader title="Redirecting..." />;
  }

  // 2. ถ้าโหลดเสร็จแล้ว และมี user, ให้ Render Component ลูก
  if (isAuthenticated) {
    return <>{children}</>;
  }
  
  // 3. เป็น fallback ระหว่างรอ redirect
  return <FullScreenLoader title="Redirecting..." />;
};