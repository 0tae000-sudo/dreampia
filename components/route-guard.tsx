"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/api";

const PROTECTED_PATHS = ["/profile"];

export default function RouteGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isProtected = PROTECTED_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );
    if (!isProtected) return;

    let isActive = true;
    const verifySession = async () => {
      try {
        await getCurrentUser();
      } catch {
        if (isActive) {
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

