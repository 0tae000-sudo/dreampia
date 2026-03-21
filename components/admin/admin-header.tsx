"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

const topMenuItems = [
  { href: "/admin/teacher", label: "선생님" },
  { href: "/admin/instructor", label: "강사" },
  { href: "/admin/school", label: "학교" },
  { href: "/admin/job", label: "직업" },
  { href: "/admin/event", label: "행사" },
] as const;

export function AdminHeader({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      <nav
        className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        aria-label="관리자 상단 메뉴"
      >
        {topMenuItems.map(({ href, label }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#4e73df]/10 text-[#224abe]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-3 border-l border-gray-200 pl-4">
        <span className="max-w-22 truncate text-sm text-gray-600 sm:max-w-none">
          <span className="font-semibold text-gray-900">{userName}</span>
          <span className="mx-2 text-gray-300 max-sm:hidden">|</span>
          <span className="max-sm:hidden">관리자</span>
        </span>
        <Link
          href="/auth/logout"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          로그아웃
        </Link>
      </div>
    </header>
  );
}
