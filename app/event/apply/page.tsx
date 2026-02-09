"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/api";

type User = {
  isTeacher: boolean | null;
};

export default function EventApplyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAccess = async () => {
      try {
        const payload = await getCurrentUser();
        const user = payload?.data as User | undefined;
        if (!user?.isTeacher) {
          alert("학교(기관) 회원만 행사접수가 가능합니다.");
          router.replace("/");
          return;
        }
      } catch {
        router.replace("/auth/login");
        return;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    checkAccess();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>EventApplyPage</div>;
}
