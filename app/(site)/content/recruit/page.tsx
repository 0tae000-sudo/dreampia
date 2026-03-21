import Hero from "@/components/hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "멘토모집",
  description: "MARS MAKE A REAL STORY",
};
export default function Recruit() {
  return (
    <div className="bg-white">
      <Hero title="멘토모집" description="MARS MAKE A REAL STORY" />

      {/* Header badge + title */}
      <section className="max-w-5xl mx-auto px-6 py-10 text-center">
        <span className="inline-block bg-[#d99b2a] text-white text-xs font-bold px-3 py-1 rounded-full">
          모두의 이야기로 세상을 바꾸는 교육
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-black text-gray-900">
          달꿈 멘토 모집
        </h2>
        <p className="mt-3 text-gray-700 text-sm md:text-base">
          지금, 멘토님의 경험을 나누고 새로운 꿈의 길잡이가 되어보세요
        </p>
      </section>

      {/* Testimonials-like mosaic cards */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow transition"
            >
              <div className="h-24 bg-gray-50 rounded-md p-3 text-[11px] text-gray-600 leading-relaxed">
                학생과의 의미 있는 만남과 질문이
                <br />
                새로운 가능성을 열어주었습니다.
              </div>
              <p className="mt-3 text-xs text-gray-500">멘토 후기</p>
            </div>
          ))}
        </div>
      </section>

      {/* Orange callout */}
      <section className="mt-10 bg-[#ef8f2a]">
        <div className="max-w-5xl mx-auto px-6 py-10 text-center text-white">
          <p className="text-xl md:text-2xl font-black">
            멘토님의 이야기가
            <br />
            진로를 고민하는 청소년에게 큰 힘이 될 수 있다면
            <br />
            어떻게요?
          </p>
        </div>
      </section>

      {/* Description paragraph */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-gray-700 leading-7 text-sm md:text-base">
          멘토가 된다는 것은 단순히 정보를 전달하는 것이 아니라, 자신의 경험을
          나누고 청소년들에게 새로운 가능성을 열어주는 일입니다. 어떤 길을
          걸어왔는지, 어떤 선택을 했는지, 그리고 어떤 도전이 있었는지 멘토님의
          이야기가 누군가에게 큰 영감이 될 수 있어요.
        </p>
      </section>

      {/* Stats with small KPI + bar chart */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl overflow-hidden bg-white border shadow">
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* KPI badge */}
            <div className="bg-[#fff3da] rounded-xl p-5">
              <p className="text-[11px] text-gray-600">
                대한민국 공교육 진로멘토링 1위
              </p>
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>달꿈은 수도권 1,263개 학교에서</p>
                <p>13,113회의 프로그램을 진행하고 있습니다.</p>
              </div>
            </div>

            {/* Donut summary */}
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#f2a23a"
                    strokeWidth="4"
                    strokeDasharray="65, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">만족도</p>
                    <p className="text-xl font-black text-[#f2a23a]">65%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini bar chart */}
            <div className="md:col-span-1">
              <div className="h-32 flex items-end gap-1">
                {[10, 18, 22, 28, 40, 55, 68, 78, 88, 100].map((h, idx) => (
                  <div key={idx} className="flex-1">
                    <div
                      className="w-full bg-[#0b4f9b] rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos grid */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: "진로 선생의 특강" },
            { title: "직업 체험" },
            { title: "진로 콘서트" },
            { title: "진로 박람회" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden border"
            >
              <img
                src={`https://images.unsplash.com/photo-15${
                  80 + idx
                }072432836-e10032774350?q=80&w=1600&auto=format&fit=crop`}
                alt={item.title}
                className="w-full h-60 object-cover"
              />
              <div className="absolute left-0 top-0 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-br">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process steps */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "멘토 회원가입", desc: "" },
            { title: "직업 및 경력 등 세부정보 입력", desc: "" },
            { title: "관리자 접수 & 면접진행", desc: "" },
            { title: "멘토등록완료 & 교육진행", desc: "" },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow">
                <span aria-hidden>🧑‍🚀</span>
              </div>
              <p className="mt-3 text-sm font-bold text-gray-800">{s.title}</p>
              {s.desc ? (
                <p className="text-xs text-gray-600 mt-1">{s.desc}</p>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-gray-700 text-sm md:text-base">
          함께 성장하며 의미 있는 시간을 만들어갈 멘토님들의 많은 관심과 지원을
          기다립니다.
        </p>

        <div className="mt-6 flex justify-center">
          <button className="px-6 py-3 rounded-full bg-[#0b4f9b] hover:brightness-110 text-white font-bold shadow">
            멘토회원가입
          </button>
        </div>
      </section>
    </div>
  );
}
