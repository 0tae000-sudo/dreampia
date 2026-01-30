"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/api";

const PROTECTED_PATHS = ["/profile"]; // 보호 경로 설정
const PUBLIC_ONLY_PATHS = ["/auth/login", "/auth/signup", "/create-account"];

export default function RouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isProtected = PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
    const isPublicOnly = PUBLIC_ONLY_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
    if (!isProtected && !isPublicOnly) return;

    let isActive = true;
    const verifySession = async () => {
      try {
        await getCurrentUser();
        if (isPublicOnly && isActive) {
          router.replace("/");
        }
      } catch {
        if (isProtected && isActive) {
          router.replace("/auth/login");
        }
      }
    };

    verifySession();
    return () => {
      isActive = false;
    };
  }, [pathname, router]);

  return null;
}

