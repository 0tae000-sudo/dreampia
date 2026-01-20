"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/fom-input";

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          roadAddress?: string;
          address?: string;
        }) => void;
      }) => { open: () => void };
    };
  }
}

const POSTCODE_SCRIPT_ID = "daum-postcode-script";

export default function TeacherSignup() {
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [domain, setDomain] = useState("");
  const scriptLoadedRef = useRef(false);
  const domainOptions = ["gmail.com", "naver.com", "daum.net"];
  const selectedDomain = domainOptions.includes(domain) ? domain : "";

  const loadPostcodeScript = useCallback(() => {
    if (scriptLoadedRef.current) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const existing = document.getElementById(
        POSTCODE_SCRIPT_ID
      ) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", () => {
          scriptLoadedRef.current = true;
          resolve();
        });
        existing.addEventListener("error", () =>
          reject(new Error("postcode script load failed"))
        );
        return;
      }

      const script = document.createElement("script");
      script.id = POSTCODE_SCRIPT_ID;
      script.src =
        "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        resolve();
      };
      script.onerror = () => reject(new Error("postcode script load failed"));
      document.body.appendChild(script);
    });
  }, []);

  const handlePostcodeSearch = useCallback(async () => {
    try {
      await loadPostcodeScript();
      if (!window.daum?.Postcode) {
        throw new Error("postcode script not available");
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          setPostcode(data.zonecode);
          setAddress(data.roadAddress || data.address || "");
        },
      }).open();
    } catch (error) {
      console.error(error);
    }
  }, [loadPostcodeScript]);

  useEffect(() => {
    loadPostcodeScript().catch(() => {
      // Script load will be retried when user clicks the button.
    });
  }, [loadPostcodeScript]);

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
                name="schoolName"
                placeholder="학교(기관)명"
                required={true}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                학교급 <span className="text-red-500">✔</span>
              </label>
              <select
                name="schoolLevel"
                required
                className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
              >
                <option>학교급 선택</option>
                <option>초등학교</option>
                <option>중학교</option>
                <option>고등학교</option>
                <option>기관</option>
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
                    name="postcode"
                    placeholder="우편번호"
                    required={true}
                    value={postcode}
                    onChange={(event) => setPostcode(event.target.value)}
                  />
                </div>
                <div className="w-full sm:w-32">
                  <button
                    className="cursor-pointer bg-orange-600 text-amber-50 rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                    type="button"
                    disabled={false}
                    onClick={handlePostcodeSearch}
                  >
                    우편번호 검색
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <FormInput
                  type="text"
                  name="address"
                  placeholder="주소(도로명)"
                  required={true}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
              <div className="mt-2">
                <FormInput
                  type="text"
                  name="detailAddress"
                  placeholder="상세주소"
                  required={true}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                교사(담당자)명 <span className="text-red-500">✔</span>
              </label>
              <FormInput
                type="text"
                name="teacherName"
                placeholder="교사명"
                required={true}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                직위 <span className="text-red-500">✔</span>
              </label>
              <FormInput
                type="text"
                name="position"
                placeholder="직위"
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
                  <button
                    type="button"
                    className="cursor-pointer bg-orange-600 text-amber-50 rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                  >
                    인증요청
                  </button>
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
                    name="email"
                    placeholder="이메일"
                    required={true}
                  />
                  <span className="text-gray-500">@</span>
                  <FormInput
                    type="text"
                    name="domain"
                    placeholder="도메인"
                    required={true}
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                  />
                </div>
                <select
                  className="bg-transparent rounded-md w-full sm:w-32 h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                  value={selectedDomain}
                  onChange={(event) => setDomain(event.target.value)}
                >
                  <option value="">직접입력</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="naver.com">naver.com</option>
                  <option value="daum.net">daum.net</option>
                </select>
              </div>
              <div className="mt-2 w-full sm:w-36">
                <button
                  type="button"
                  className="cursor-pointer bg-orange-600 text-amber-50 rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                >
                  이메일 중복확인
                </button>
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

            <div className="pt-4 flex justify-center">
              <div className="w-full sm:w-48">
                <FormButton
                  className="cursor-pointer"
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
