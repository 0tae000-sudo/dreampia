"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/api";

export type User = {
  id: number;
  name: string;
  email: string | null;
  role: string | null;
  isTeacher: boolean | null;
  isMentor: boolean | null;
  schoolName?: string | null;
  phone?: string | null;
  address?: string | null;
  position?: string | null;
};

const ProfileContext = createContext<{ user: User | null }>({ user: null });

export function useProfileUser() {
  const ctx = useContext(ProfileContext);
  return ctx.user;
}

const tabs = [
  { id: "home", label: "마이홈", href: "/profile" },
  { id: "events", label: "행사현황", href: "/profile/events" },
  { id: "password", label: "비밀번호 변경", href: "/profile/password" },
  { id: "withdraw", label: "회원탈퇴", href: "/profile/withdraw" },
] as const;

function isTabActive(pathname: string, tabHref: string) {
  if (tabHref === "/profile") {
    return pathname === "/profile" || pathname === "/profile/";
  }
  return pathname.startsWith(tabHref);
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const payload = await getCurrentUser();
        if (isMounted) {
          setUser(payload.data as User);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            typeof error === "object" && error !== null && "message" in error
              ? String((error as { message?: string }).message)
              : "로그인이 필요합니다.";
          setErrorMessage(message);
          router.replace("/auth/login");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1e4a85] border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-600">
        {errorMessage ?? "로그인이 필요합니다."}
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={{ user }}>
      <div className="min-h-screen bg-gray-50">
        {/* 배너 섹션 */}
        <div className="relative h-48 overflow-hidden bg-[#1e4a85] sm:h-56">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Crect fill='%23d1d5db' x='10' y='10' width='20' height='30' rx='2'/%3E%3Crect fill='%23d1d5db' x='40' y='10' width='20' height='30' rx='2'/%3E%3Crect fill='%23d1d5db' x='70' y='10' width='20' height='30' rx='2'/%3E%3Crect fill='%239ca3af' y='60' width='100' height='15'/%3E%3Crect fill='%23e5e7eb' x='5' y='80' width='30' height='15' rx='1'/%3E%3Crect fill='%23e5e7eb' x='65' y='80' width='30' height='15' rx='1'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative flex h-full flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              마이페이지
            </h1>
            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-amber-400 sm:text-base">
              MARS MAKE A REAL STORY
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <div className="flex overflow-x-auto rounded-lg shadow-sm">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`min-w-[120px] flex-1 px-4 py-3 text-center text-sm font-medium transition-colors sm:min-w-0 ${
                  isTabActive(pathname ?? "", tab.href)
                    ? "bg-[#1e4a85] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 pb-12">{children}</div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
}
