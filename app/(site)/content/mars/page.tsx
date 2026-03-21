import Hero from "@/components/hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "마스란?",
  description: "MARS MAKE A REAL STORY",
};
export default function Mars() {
  return (
    <div className="bg-white">
      <Hero title="마스란?" description="MARS MAKE A REAL STORY" />

      {/* Top banner area (dark) */}
      <section className="bg-[#003468] text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm md:text-base font-semibold">
              <span className="text-[#ffcc33]">진로교육 전문 달꿈</span>에서
              운영하는
            </p>
            <p className="text-2xl md:text-3xl font-black mt-1">
              멘토링 플랫폼 입니다.
            </p>
          </div>

          {/* Mock phone with MARS logo */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <span className="hidden md:inline-block text-5xl" aria-hidden>
              🧑‍🚀
            </span>
            <div className="relative w-[230px] h-[420px] rounded-[36px] bg-black/70 border-8 border-black shadow-2xl">
              <div className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-1.5 rounded-full bg-black/40" />
              <div className="absolute inset-[14px] rounded-[26px] bg-[#e94235] flex flex-col items-center justify-center text-white">
                <div className="w-24 h-24 rounded-full bg-white/95 flex items-center justify-center shadow">
                  <span className="text-4xl" aria-hidden>
                    🚀
                  </span>
                </div>
                <strong className="mt-4 tracking-widest text-3xl">MARS</strong>
                <span className="text-[10px] opacity-90 mt-1">
                  MAKE A REAL STORY
                </span>
              </div>
            </div>
            <span
              className="hidden md:inline-block text-5xl -scale-x-100"
              aria-hidden
            >
              🧑‍🚀
            </span>
          </div>
        </div>
      </section>

      {/* Description copy */}
      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center text-gray-800">
          <p className="text-lg md:text-xl font-black leading-relaxed">
            달리는 꿈을 응원하기 위해
          </p>
          <p className="mt-2 leading-relaxed">
            꿈과 꿈을 이어주고 이야기를 이어주며 멘토와 멘티를 이어주는
          </p>
          <p className="mt-1 font-semibold">멘토링 플랫폼 입니다.</p>
        </div>
      </section>

      {/* Classroom hero with overlay text */}
      <section>
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=1600&auto=format&fit=crop"
              alt="classroom"
              className="w-full h-[260px] md:h-[360px] object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <span className="bg-[#003468] text-white px-6 py-2 rounded-full text-lg font-extrabold shadow">
                Make A Real Story
              </span>
              <p className="mt-4 text-white/95 text-sm md:text-base font-semibold">
                모두의 이야기로 세상을 바꾸는 교육
              </p>
            </div>
          </div>

          {/* Cute astronaut */}
          <div className="mt-10 flex justify-center text-5xl" aria-hidden>
            🧑‍🚀
          </div>

          {/* Store badges */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="#" aria-label="Get it on Google Play" className="shrink-0">
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                className="h-12 md:h-14 object-contain"
              />
            </a>
            <a
              href="#"
              aria-label="Download on the App Store"
              className="shrink-0"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                className="h-12 md:h-14 object-contain"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
