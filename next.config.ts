import type { NextConfig } from "next";

const isApp = process.env.NEXT_PUBLIC_IS_APP === "true";

const nextConfig: NextConfig = {
  output: isApp ? "export" : undefined, // 정적 HTML 내보내기 활성화
  trailingSlash: true, // 모든 경로 끝에 /를 붙여 정적 파일 구조 최적화
  images: {
    unoptimized: isApp ? true : false, // 이미지 최적화 비활성화
  },
};

export default nextConfig;
