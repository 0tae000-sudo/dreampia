"use client";

import FormInput from "@/components/input";
import FormButton from "@/components/form-btn";
import { useState } from "react";

export default function FindMy() {
  const [tab, setTab] = useState<"id" | "password">("id");

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-gray-900">
      {/* Hero banner */}
      <section className="relative h-[220px] md:h-[260px] bg-[#3b4356] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop"
          alt="find my banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center">
          <p className="text-2xl md:text-3xl font-black tracking-[0.2em]">
            아이디/비밀번호 찾기
          </p>
          <p className="mt-3 text-[#f2b644] font-bold tracking-[0.3em] text-sm md:text-base">
            MARS MAKE A REAL STORY
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          {/* Tabs */}
          <div className="grid grid-cols-2 border rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setTab("id")}
              className={`py-3 font-bold text-sm ${
                tab === "id"
                  ? "bg-[#3f51b5] text-white"
                  : "bg-[#eef1ff] text-gray-600"
              }`}
            >
              아이디
            </button>
            <button
              type="button"
              onClick={() => setTab("password")}
              className={`py-3 font-bold text-sm ${
                tab === "password"
                  ? "bg-[#3f51b5] text-white"
                  : "bg-[#eef1ff] text-gray-600"
              }`}
            >
              비밀번호
            </button>
          </div>

          <div className="mt-6 max-w-xl mx-auto">
            {tab === "id" ? (
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    이름 <span className="text-red-500">✔</span>
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
                      <FormInput
                        type="text"
                        name="phone1"
                        placeholder="010"
                        required={true}
                      />
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
                      <FormButton
                        type="button"
                        loading={false}
                        disabled={false}
                        text="인증요청"
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    이메일 <span className="text-red-500">✔</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <FormInput
                        type="text"
                        name="email"
                        required={true}
                        placeholder="이메일"
                      />
                      <span className="text-gray-500">@</span>
                      <FormInput
                        type="text"
                        name="domain"
                        required={true}
                        placeholder="도메인"
                      />
                    </div>
                    <select className="border rounded-md px-2 py-2 text-base text-gray-600 w-full sm:w-auto">
                      <option>직접입력</option>
                      <option>gmail.com</option>
                      <option>naver.com</option>
                      <option>daum.net</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    이름 <span className="text-red-500">✔</span>
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
                      <FormInput
                        type="text"
                        name="phone1"
                        placeholder="010"
                        required={true}
                      />
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
                    <FormButton
                      type="button"
                      loading={false}
                      disabled={false}
                      text="인증요청"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="px-6 py-3 rounded-md bg-[#c84626] text-white font-bold flex items-center gap-2">
              🔍 아이디/비밀번호 찾기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
