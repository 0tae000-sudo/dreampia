"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfileUser } from "@/lib/auth/api";
import { AlertCircle } from "lucide-react";

type ProfileUser = {
  position: string;
  id: number;
  name: string;
  email: string | null;
  role: string | null;
  isTeacher: boolean | null;
  isMentor: boolean | null;
  schoolName: string | null;
  phone: string | null;
  address: string | null;
  postcode: string | null;
  detailAddress: string | null;
};

export default function ProfileHomePage() {
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const payload = await getProfileUser();
        if (isMounted) {
          setProfile(payload.data as ProfileUser);
          console.log(payload.data);
        }
      } catch {
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const memberInfoRows = profile
    ? [
        {
          label: "학교(기관)명",
          value: profile.schoolName ?? "-(등록된 정보 없음)",
        },
        { label: "주소", value: profile.address ?? "-(등록된 정보 없음)" },
        { label: "교사(담당자)명", value: profile.name },
        {
          label: "직위",
          value: profile.position ?? "-(등록된 정보 없음)",
        },
        {
          label: "연락처",
          value: profile.phone ?? "-(등록된 정보 없음)",
        },
        {
          label: "메일주소",
          value: profile.email ?? "-(등록된 정보 없음)",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* 회원정보 */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-6 py-4 text-lg font-bold text-red-600">
          회원정보
        </h2>
        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col px-6 py-4 sm:flex-row sm:items-center"
              >
                <div className="h-4 w-32 shrink-0 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 flex-1 animate-pulse rounded bg-gray-100 sm:mt-0" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {memberInfoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col px-6 py-4 sm:flex-row sm:items-center"
                >
                  <dt className="w-32 shrink-0 font-bold text-gray-700">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-gray-600 sm:mt-0 sm:flex-1">
                    {row.value}
                  </dd>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-gray-100 bg-rose-50/50 px-6 py-4">
              <p className="flex items-start gap-2 text-sm text-rose-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                회원가입이 완료된 경우 정보수정이 제한됩니다.
              </p>
              <p className="flex items-start gap-2 text-sm text-rose-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                회원정보 수정이 필요한 경우, 담당자에게 문의바랍니다.
              </p>
            </div>
          </>
        )}
      </section>

      {/* 공지사항 */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-6 py-4 text-lg font-bold text-red-600">
          공지사항
        </h2>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-gray-700">[교사] 회원가입 안내</span>
            <span className="text-sm text-gray-500">2025-03-27</span>
          </div>
          <Link
            href="#"
            className="ml-4 shrink-0 rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
          >
            + 더보기
          </Link>
        </div>
      </section>

      {/* 1:1문의 */}
      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-6 py-4 text-lg font-bold text-red-600">
          1:1문의
        </h2>
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-gray-500">등록된 문의사항이 없습니다.</span>
          <Link
            href="#"
            className="shrink-0 rounded bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
          >
            + 더보기
          </Link>
        </div>
      </section>
    </div>
  );
}
