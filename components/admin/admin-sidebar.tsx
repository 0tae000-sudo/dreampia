"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Megaphone,
  Images,
  Hash,
  BookOpen,
  Package,
  Users,
  ListTodo,
} from "lucide-react";

const menuItems = [
  { href: "/admin/company", label: "회사소개", icon: Building2 },
  { href: "/admin/terms", label: "이용약관", icon: FileText },
  { href: "/admin/notice", label: "공지사항", icon: Megaphone },
  { href: "/admin/banners", label: "배너관리", icon: Images },
  { href: "/admin/counter", label: "카운터 관리", icon: Hash },
  { href: "/admin/programs", label: "프로그램 관리", icon: BookOpen },
  { href: "/admin/supplies", label: "준비물 관리", icon: Package },
  { href: "/admin/mentors", label: "멘토 관리", icon: Users },
  { href: "/admin/todos", label: "나의 할일", icon: ListTodo },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-linear-to-b from-[#4e73df] to-[#224abe] text-white shadow-lg">
      {/* 로고 영역 (SB Admin 2 스타일) */}
      <Link
        href="/admin"
        className="flex items-center gap-3 border-b border-white/10 px-4 py-5 font-bold tracking-tight hover:bg-white/5"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg">
          ●
        </span>
        <span className="text-lg leading-tight">
          MARS
          <span className="ml-1 text-sm font-semibold opacity-90">ADMIN</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-white/50">
          관리 메뉴
        </p>
        {menuItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="block rounded-md px-3 py-2 text-center text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white"
        >
          사이트로 돌아가기
        </Link>
      </div>
    </aside>
  );
}
