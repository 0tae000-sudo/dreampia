import FormButton from "@/components/form-btn";
import FormInput from "@/components/fom-input";

export default function TeacherSignup() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] text-gray-900">
      {/* Hero banner */}
      <section className="relative h-[220px] md:h-[260px] bg-[#3b4356] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop"
          alt="signup banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center">
          <p className="text-2xl md:text-3xl font-black tracking-[0.2em]">
            회원 가입
          </p>
          <p className="mt-3 text-[#f2b644] font-bold tracking-[0.3em] text-sm md:text-base">
            MARS MAKE A REAL STORY
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center">
          <span className="inline-block bg-[#e35b2f] text-white text-xs font-bold px-4 py-1 rounded">
            - 회원정보입력 -
          </span>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                학교(기관)명 <span className="text-red-500">✔</span>
              </label>
              <FormInput
                type="text"
                placeholder="학교(기관)명"
                required={true}
                errors={[]}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                학교급 <span className="text-red-500">✔</span>
              </label>
              <select
                required
                className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
              >
                <option>학교급 선택</option>
                <option>초등학교</option>
                <option>중학교</option>
                <option>고등학교</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                주소 <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1">
                  <FormInput
                    type="text"
                    placeholder="우편번호"
                    required={true}
                    errors={[]}
                  />
                </div>
                <div className="w-full sm:w-32">
                  <FormButton
                    type="button"
                    loading={false}
                    disabled={false}
                    text="우편번호검색"
                  />
                </div>
              </div>
              <div className="mt-2">
                <FormInput
                  type="text"
                  placeholder="주소(도로명)"
                  required={true}
                  errors={[]}
                />
              </div>
              <div className="mt-2">
                <FormInput
                  type="text"
                  placeholder="상세주소"
                  required={true}
                  errors={[]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                교사(담당자)명 <span className="text-red-500">✔</span>
              </label>
              <FormInput
                type="text"
                placeholder="교사명"
                required={true}
                errors={[]}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                직위 <span className="text-red-500">✔</span>
              </label>
              <FormInput
                type="text"
                placeholder="직위"
                required={true}
                errors={[]}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                연락처 <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                  <div className="w-20">
                    <FormInput
                      type="text"
                      placeholder="010"
                      required={true}
                      errors={[]}
                    />
                  </div>
                  <FormInput
                    type="text"
                    placeholder="1234"
                    required={true}
                    errors={[]}
                  />
                  <FormInput
                    type="text"
                    placeholder="5678"
                    required={true}
                    errors={[]}
                  />
                </div>
                <div className="w-full sm:w-28">
                  <FormButton
                    type="button"
                    loading={false}
                    disabled={false}
                    text="인증요청"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                이메일 <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                  <FormInput
                    type="text"
                    placeholder="이메일"
                    required={true}
                    errors={[]}
                  />
                  <span className="text-gray-500">@</span>
                  <FormInput
                    type="email"
                    placeholder="도메인"
                    required={true}
                    errors={[]}
                  />
                </div>
                <select className="bg-transparent rounded-md w-full sm:w-32 h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base">
                  <option>직접입력</option>
                  <option>gmail.com</option>
                  <option>naver.com</option>
                  <option>daum.net</option>
                </select>
              </div>
              <div className="mt-2 w-full sm:w-36">
                <FormButton
                  type="button"
                  loading={false}
                  disabled={false}
                  text="이메일 중복확인"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                비밀번호 <span className="text-red-500">✔</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FormInput
                  type="password"
                  placeholder="비밀번호"
                  required={true}
                  errors={[]}
                />
                <FormInput
                  type="password"
                  placeholder="비밀번호확인"
                  required={true}
                  errors={[]}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <div className="w-full sm:w-48">
                <FormButton
                  type="button"
                  loading={false}
                  disabled={false}
                  text="MARS 회원 가입"
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
