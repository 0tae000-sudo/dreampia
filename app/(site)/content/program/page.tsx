import Hero from "@/components/hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "진로교육 프로그램 안내",
  description: "MARS MAKE A REAL STORY",
};
export default function Program() {
  const chartHeights = [10, 18, 22, 30, 35, 42, 48, 60, 78, 100]; // normalized bar heights
  const chartYears = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2021",
    "2022",
    "2023",
    "2024A",
    "2024",
  ];
  return (
    <div className="bg-white">
      <Hero
        title="진로교육 프로그램 안내"
        description="MARS MAKE A REAL STORY"
      />

      {/* Intro headline + hashtags */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center">
          <span className="inline-block bg-[#1f76c2] text-white text-xs font-bold px-3 py-1 rounded-full">
            아래의 항목중 하나라도 해당 한다면?
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-black leading-tight text-gray-900">
            이제는 달꿈에서
            <br />
            진로교육 해야 할때!
          </h2>
        </div>
        <div className="mt-6 text-center text-gray-700 space-y-1 text-sm md:text-base">
          <p>#학생 맞춤형 진로활동을 진행하고 싶다.</p>
          <p>#전문 직업인과 함께하는 진로 멘토링을 찾고있다.</p>
          <p>#프로그램을 안정적으로 운영하는 것이 중요하다.</p>
          <p>#합리적인 가격에 높은 효과를 낼 수 있기를 원한다.</p>
          <p>#미래역량을 키우기 위한 4차 산업교육이 필요하다.</p>
        </div>
      </section>

      {/* Stats + bar chart */}
      <section className="bg-[#1f9fd3]/20">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="bg-[#1f9fd3] text-white rounded-2xl p-6 md:p-10 shadow">
            <h3 className="text-lg md:text-2xl font-black">
              11년 동안 <span className="text-yellow-300">2,162,129명</span>의
              청소년과 함께한 달꿈의 진로멘토링을 경험해보세요
            </h3>
            <div className="mt-8 bg-white rounded-xl p-4 md:p-6 text-gray-900">
              <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Left cumulative box */}
                <div className="md:w-64 bg-[#e9f6ff] rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-600">누적 학생수</p>
                  <p className="text-2xl font-black text-[#1f76c2]">216만명</p>
                  <p className="text-[11px] text-gray-500">
                    (전국 초,중,고등학교)
                  </p>
                </div>
                {/* Chart */}
                <div className="flex-1">
                  <div className="h-56 md:h-64 flex items-end gap-2 md:gap-3">
                    {chartHeights.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-[#1f76c2] rounded-t-md"
                          style={{ height: `${h}%` }}
                          aria-hidden
                        />
                        <span className="mt-2 text-[10px] md:text-xs text-gray-500">
                          {chartYears[idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KPI cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b4f9b] text-white rounded-lg p-5 text-center">
                  <p className="text-xs opacity-90">누적 프로그램 진행 횟수</p>
                  <p className="text-3xl font-black mt-1">13,113회</p>
                  <p className="text-[10px] opacity-70 mt-1">
                    2024년 12월 기준
                  </p>
                </div>
                <div className="bg-[#0b4f9b] text-white rounded-lg p-5 text-center">
                  <p className="text-xs opacity-90">연간 재방문율</p>
                  <p className="text-3xl font-black mt-1">93.2%</p>
                  <p className="text-[10px] opacity-70 mt-1">
                    2024년 12월 기준
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Satisfaction */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl p-8 border">
          <div className="flex items-center gap-6">
            <div className="text-6xl" aria-hidden>
              👩‍🏫
            </div>
            <div>
              <p className="text-gray-600 font-semibold">교사 만족도</p>
              <p className="text-4xl font-black text-gray-900">
                4.8<span className="text-gray-500 text-2xl">/5</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-6xl" aria-hidden>
              🧑‍🎓
            </div>
            <div>
              <p className="text-gray-600 font-semibold">학생 만족도</p>
              <p className="text-4xl font-black text-gray-900">
                4.7<span className="text-gray-500 text-2xl">/5</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process steps + CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900">
            철저한 관리로 완벽한 교육을 제공합니다
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            #11년노하우 #단계별완벽관리 #교육품질보장
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              d: "D-28",
              title: "행사 4주전",
              lines: ["진로교육 협의 준비"],
              icon: "🧑‍🚀",
              color: "bg-sky-50",
            },
            {
              d: "D-21",
              title: "행사 3주전",
              lines: ["섭외 완료 및", "행정 서류 발송"],
              icon: "🧑‍🚀",
              color: "bg-sky-50",
            },
            {
              d: "D-14",
              title: "행사 2주전",
              lines: ["수강신청", "진행"],
              icon: "🧑‍🚀",
              color: "bg-sky-50",
            },
            {
              d: "D-1",
              title: "행사 1일전",
              lines: ["분반/사전", "최종확인"],
              icon: "🧑‍🚀",
              color: "bg-sky-50",
            },
            {
              d: "D-day",
              title: "행사 당일",
              lines: ["현장담당자가", "행사 전담 관리"],
              icon: "🧑‍🚀",
              color: "bg-sky-50",
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className={`${step.color} rounded-xl p-5 border border-sky-100 text-center`}
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow">
                <span aria-hidden>{step.icon}</span>
              </div>
              <p className="mt-3 text-[#1f76c2] font-black">{step.d}</p>
              <p className="text-sm font-semibold">{step.title}</p>
              <div className="mt-2 text-gray-600 text-sm leading-snug">
                {step.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 rounded-full bg-[#ff5a3c] hover:brightness-110 text-white font-bold shadow">
            진로교육 프로그램 신청하기
          </button>
        </div>
      </section>
    </div>
  );
}
