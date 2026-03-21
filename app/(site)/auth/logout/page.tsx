"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { logoutUser } from "@/lib/auth/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const runLogout = async () => {
      try {
        await logoutUser();
      } finally {
        if (isMounted) {
          router.replace("/");
          router.refresh();
        }
      }
    };
    runLogout();
    return () => {
      isMounted = false;
    };
  }, [router]);

  return <div>로그아웃 중...</div>;
}
