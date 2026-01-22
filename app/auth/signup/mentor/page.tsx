import FormButton from "@/components/form-btn";
import FormInput from "@/components/input";

export default function MentorSignup() {
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
                아이디(이메일){" "}
                <span className="text-xs text-gray-500">*추후 변경 불가</span>{" "}
                <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                  <FormInput
                    type="text"
                    name="id"
                    placeholder="아이디"
                    required={true}
                  />
                  <span className="text-gray-500">@</span>
                  <FormInput
                    type="text"
                    name="domain"
                    placeholder="도메인"
                    required={true}
                  />
                </div>
                <div className="w-full sm:w-28">
                  <FormButton
                    type="button"
                    loading={false}
                    disabled={false}
                    text="중복확인"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                비밀번호 <span className="text-red-500">✔</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <FormInput
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  required={true}
                />
                <FormInput
                  type="password"
                  name="passwordConfirm"
                  placeholder="비밀번호확인"
                  required={true}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                이름{" "}
                <span className="text-xs text-gray-500">
                  *주민등록상 실명기재 필수
                </span>{" "}
                <span className="text-red-500">✔</span>
              </label>
              <FormInput
                type="text"
                name="name"
                placeholder="이름"
                required={true}
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
                      name="phone1"
                      placeholder="010"
                      required={true}
                    />
                  </div>
                  <FormInput
                    type="text"
                    name="phone2"
                    placeholder="1234"
                    required={true}
                  />
                  <FormInput
                    type="text"
                    name="phone3"
                    placeholder="5678"
                    required={true}
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
                가입경로 <span className="text-red-500">✔</span>
              </label>
              <select
                required
                className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
              >
                <option>가입경로 선택</option>
                <option>지인 추천</option>
                <option>온라인 검색</option>
                <option>SNS</option>
                <option>기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                학력사항(최종학력) <span className="text-red-500">✔</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <FormInput
                  type="text"
                  name="graduationYear"
                  placeholder="졸업연도"
                  required={true}
                />
                <FormInput
                  type="text"
                  name="schoolName"
                  placeholder="학교명"
                  required={true}
                />
                <FormInput
                  type="text"
                  name="major"
                  placeholder="전공"
                  required={true}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                한줄 자기소개 <span className="text-red-500">✔</span>
              </label>
              <FormInput
                type="text"
                name="selfIntroduction"
                placeholder="한줄 자기소개"
                required={true}
              />
            </div>
          </form>
        </div>

        <div className="mt-6 bg-[#eef2ff] border border-[#d9e1ff] rounded-md px-4 py-3 text-sm text-gray-700">
          <span className="text-red-500 font-bold">!</span>{" "}
          직업멘토링/직업체험을 위한 멘토님의 직업을 등록해주세요. (1개 필수,
          최대 3개 등록 가능)
        </div>

        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white rounded-md border p-4">
              <p className="font-bold text-sm mb-2">
                직업{idx} <span className="text-red-500">✔</span>
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1">
                  <FormInput
                    type="text"
                    name="job1"
                    placeholder="직업검색"
                    required={idx === 1}
                  />
                </div>
                <div className="w-full sm:w-24">
                  <FormButton
                    type="button"
                    loading={false}
                    disabled={false}
                    text="검색"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <div className="w-full sm:w-32">
            <FormButton
              type="button"
              loading={false}
              disabled={false}
              text="임시저장"
            />
          </div>
          <div className="w-full sm:w-32">
            <FormButton
              type="button"
              loading={false}
              disabled={false}
              text="회원가입"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
