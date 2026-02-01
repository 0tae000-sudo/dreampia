import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import QueryProvider from "@/components/QueryProvider";
import RouteGuard from "@/components/route-guard";
import ToastProvider from "@/components/toast-provider";

// 모바일 기기 노치 및 상태바 대응을 위한 필수 설정
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MARS",
  description: "MARS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* pt-[env(safe-area-inset-top)]: 상단 상태바/노치 겹침 방지
          pb-[env(safe-area-inset-bottom)]: 아이폰 하단 홈 바 대응 
      */}
      <body className="flex flex-col min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-gray-50">
        {/* 메인 콘텐츠 영역 (나머지 공간을 꽉 채우도록 flex-1 적용) */}
        <QueryProvider>
          <ToastProvider>
            <RouteGuard />
            <header className="w-full max-w-7xl mx-auto px-4 py-4 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-2">
                <Link
                  href="/"
                  className="font-black text-2xl flex items-center text-[#003468]"
                >
                  <span className="text-blue-500 mr-2">●</span> MARS
                </Link>
              </div>
              <div className="flex space-x-4 text-sm font-bold text-gray-700">
                <Link
                  href="/auth/login"
                  className="flex items-center hover:text-blue-600"
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center text-red-500 hover:text-red-700"
                >
                  회원가입
                </Link>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            {/* 푸터 영역 (image_11a4c4.png 디자인 구현) */}
            <footer className="bg-[#1e4a85] text-white py-10 px-6 text-center text-sm font-light">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* 로고 영역 */}
                <div className="flex justify-center">
                  <img src="/mars-logo.png" alt="MARS" className="h-16 w-auto" />
                </div>

                {/* 약관 링크 */}
                <div className="flex justify-center space-x-4 font-bold text-base border-b border-white/20 pb-4">
                  <button>이용약관</button>
                  <button className="text-[#6bb9f0]">개인정보처리방침</button>
                </div>

                {/* 사업자 정보 */}
                <div className="space-y-1 opacity-80 leading-relaxed text-xs sm:text-sm">
                  <p>(주) 달꿈 | 대표 : 이수인 | 사업자등록번호 : 215-87-96093</p>
                  <p>
                    주소 : 서울특별시 서초구 양재천로 17길 22 두원빌딩 3층 | TEL :
                    02-514-1110
                  </p>
                  <p>E-mail : jinro@dalkkum.com | 개인정보보호 책임자 : 이진수</p>
                </div>

                {/* 카피라이트 */}
                <p className="pt-2 text-[10px] sm:text-xs opacity-60">
                  Copyright © DALKKUM all right reserved.
                </p>
              </div>
            </footer>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
