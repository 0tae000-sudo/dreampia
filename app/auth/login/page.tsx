"use client";

import FormInput from "@/components/fom-input";
import FormButton from "@/components/form-btn";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/api";

export default function Login() {
  // mutation 정의
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("성공!", data);
      alert("로그인에 성공했습니다.");
    },
    onError: (error) => {
      console.error("에러 발생:", error);
      alert("로그인 중 문제가 발생했습니다.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 데이터 전송 시작
    mutation.mutate({ email: "test@test.com", password: "1234" });
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-gray-900">
      {/* Hero banner */}
      <section className="relative h-[220px] md:h-[260px] bg-[#3b4356] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1600&auto=format&fit=crop"
          alt="login banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center">
          <p className="text-2xl md:text-3xl font-black tracking-[0.2em]">
            회원 로그인
          </p>
          <p className="mt-3 text-[#f2b644] font-bold tracking-[0.3em] text-sm md:text-base">
            MARS MAKE A REAL STORY
          </p>
        </div>
      </section>

      {/* Login form card */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-10">
          <div className="border-b pb-4">
            <h2 className="text-xl font-black">MARS LOGIN</h2>
            <div className="mt-2 h-0.5 w-24 bg-[#e35b2f]" />
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 max-w-md mx-auto space-y-4"
          >
            <FormInput
              name="email"
              autoComplete="email"
              type="email"
              placeholder="이메일주소(아이디)"
              required={true}
            />
            <FormInput
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              required={true}
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="accent-[#e35b2f]" /> 자동로그인
            </label>
            <span className="cursor-pointer">
              <FormButton
                type="submit"
                loading={mutation.isPending}
                disabled={mutation.isPending}
                text="로그인"
              />
              {mutation.isError && (
                <p className="text-red-500">로그인 중 문제가 발생했습니다.</p>
              )}
            </span>
            <div className="text-center text-xs text-gray-600">
              <Link href="/auth/findmy">아이디/비밀번호 찾기</Link>{" "}
              <span className="mx-2">|</span>{" "}
              <Link href="/auth/signup">회원가입</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
