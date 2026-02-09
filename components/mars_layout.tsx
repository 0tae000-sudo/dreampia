import Link from "next/link";
import React from "react";

// 1. 그리드 아이템 컴포넌트
const GridItem = ({
  title,
  icon,
  bgColor,
  span = "col-span-1",
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  bgColor: string;
  span?: string;
  children?: React.ReactNode;
}) => (
  <div
    className={`${bgColor} ${span} p-8 text-white min-h-[100px] flex flex-col justify-between relative overflow-hidden transition-all hover:brightness-110 cursor-pointer`}
  >
    <div className="relative z-10">
      <h2 className="text-2xl font-bold border-b-2 border-white inline-block pb-1 mb-4">
        {title}
      </h2>
      {icon && <div className="mt-4 opacity-80">{icon}</div>}
    </div>
    {children}
  </div>
);

const MarsLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Grid: 이미지의 반응형 변화를 결정하는 핵심 부분 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 bg-[#003468] border-2 border-[#003468] rounded-sm overflow-hidden">
          <Link href="/content/mars">
            <GridItem
              title="마스란?"
              bgColor="bg-[#004a8d]"
              icon={
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              }
            />
          </Link>

          {/* <Link href="/content/program"> */}
          <Link href="/profile">
            <GridItem title="진로교육 프로그램 안내" bgColor="bg-[#003468]">
              <div className="absolute right-4 bottom-4 text-6xl opacity-20">
                🔍
              </div>
            </GridItem>
          </Link>
          <GridItem title="수강신청" bgColor="bg-[#00a2e8]">
            <div className="absolute right-4 bottom-4 text-6xl opacity-30">
              ✍️
            </div>
          </GridItem>

          <Link href="/event/apply">
            <GridItem title="행사신청" bgColor="bg-[#4d7eb3]">
              <div className="absolute right-4 bottom-4 text-6xl opacity-30">
                🏫
              </div>
            </GridItem>
          </Link>
          <Link href="/content/recruit">
            <GridItem title="멘토모집" bgColor="bg-[#004a8d]">
              <div className="absolute right-4 bottom-4 text-6xl opacity-30">
                🎓
              </div>
            </GridItem>
          </Link>

          {/* 데스크탑에서만 보이는 빈 공간/장식 영역 */}
          <div className="hidden xl:block xl:col-span-3 bg-[#004a8d] relative">
            <div className="absolute inset-0 flex items-center justify-end pr-8">
              <span className="text-white/20 text-4xl font-black italic">
                MAKE A REAL STORY
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* Banner Slider Section */}
          <div className="lg:flex-1">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 relative h-full flex flex-col justify-center min-h-[300px]">
              <span className="text-blue-600 font-bold mb-2 inline-block">
                현직 직업인과 함께하는
              </span>
              <h3 className="text-3xl font-black text-gray-800 mb-6">
                초등학교 직업체험
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "초등학교 전문",
                  "체험 위주",
                  "다양한 직업",
                  "안전한 운영",
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium border border-blue-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="absolute right-6 bottom-6 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:shadow-lg transition-all">
                프로그램 바로가기
              </button>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="lg:w-80 space-y-6">
            {/* Notice Board */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b border-gray-50">
                <h3 className="font-bold text-gray-800 flex items-center">
                  <span className="w-1 h-4 bg-red-500 mr-2"></span>공지사항
                </h3>
                <button className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded tracking-tighter hover:bg-gray-200">
                  + MORE
                </button>
              </div>
              <div className="p-10 text-center text-gray-400 text-sm italic">
                등록된 공지사항이 없습니다.
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-800 rounded-xl p-6 text-white text-sm shadow-xl">
              <div className="space-y-3 opacity-90">
                <p className="flex justify-between">
                  <span>고객센터</span>{" "}
                  <strong className="text-lg">02-514-1110</strong>
                </p>
                <p className="flex justify-between">
                  <span>운영시간</span> <span>평일 10:00 ~ 17:00</span>
                </p>
                <p className="flex justify-between border-t border-gray-700 pt-3">
                  <span>이메일</span> <span>jinro@dalkkum.com</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-6">
                <button className="bg-[#2db400] py-2 rounded font-bold text-xs">
                  N 블로그
                </button>
                <button className="bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500 py-2 rounded font-bold text-xs">
                  인스타그램
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarsLayout;
