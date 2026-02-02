"use client";

import Input from "@/components/input";
import FormButton from "@/components/form-btn";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/lib/auth/api";
import { ApiError } from "@/lib/api-utils";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast-provider";

type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function Login() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const mutation = useMutation<unknown, ApiError, LoginPayload>({
    mutationFn: (userData: LoginPayload) => loginUser(userData),
    onSuccess: (data) => {
      setFieldErrors({});
      setFormError(null);
      showToast("로그인에 성공했습니다.", "success");
      router.push("/profile/");
    },
    onError: (error) => {
      console.log("로그인 에러", error);
      console.log("필드에러", error.fieldErrors);
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        setFormError(null);
        return;
      }
      setFieldErrors({});
      setFormError(error.message || "로그인 중 문제가 발생했습니다.");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const payload: LoginPayload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on",
    };
    mutation.mutate(payload);
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
            {formError && (
              <p className="text-sm text-red-500 text-center">{formError}</p>
            )}
            <Input
              name="email"
              autoComplete="email"
              type="email"
              placeholder="이메일주소(아이디)"
              required={true}
              errors={fieldErrors.email}
            />
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              required={true}
              errors={fieldErrors.password}
              minLength={PASSWORD_MIN_LENGTH}
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                name="rememberMe"
                type="checkbox"
                className="accent-[#e35b2f]"
              />{" "}
              자동로그인
            </label>
            <span className="cursor-pointer">
              <FormButton
                type="submit"
                loading={mutation.isPending}
                disabled={mutation.isPending}
                text="로그인"
              />
            </span>
            <div className="text-center text-sm text-gray-600 mt-2 font-bold">
              <Link
                href="/auth/findmy"
                className="text-gray-600 hover:text-gray-900"
              >
                아이디/비밀번호 찾기
              </Link>
              <span className="mx-2">|</span>{" "}
              <Link
                href="/auth/signup"
                className="text-gray-600 hover:text-gray-900"
              >
                회원가입
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
