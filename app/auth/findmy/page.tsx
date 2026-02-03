"use client";

import FormInput from "@/components/input";
import FormButton from "@/components/form-btn";
import Link from "next/link";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { findId, resetPassword, verifyPhone } from "@/lib/auth/api";
import { ApiError } from "@/lib/api-utils";
import { useToast } from "@/components/toast-provider";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import { useRouter } from "next/navigation"; 

export default function FindMy() {
  const router = useRouter();
  const [token, setToken] = useState<boolean>(false);
  const [passwordTokenSent, setPasswordTokenSent] = useState<boolean>(false);
  const [passwordVerified, setPasswordVerified] = useState<boolean>(false);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [foundEmail, setFoundEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<"id" | "password">("id");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const mutation = useMutation<
    unknown, // 성공시 반환 데이터 타입
    ApiError, // 에러타입
    Record<string, string>, // mutate에 넘기는 변수 타입(요청 payload)
    { prevState?: unknown } // onMutate에서 반환되는 conext 타입
  >({
    mutationFn: (userData: Record<string, string>) =>
      verifyPhone({
        phone1: userData.phone1,
        phone2: userData.phone2,
        phone3: userData.phone3,
        token: userData.token,
        purpose: "id",
      }),
    onMutate: async (newData) => {
      // 요청직전 실행
      await queryClient.cancelQueries({ queryKey: ["verifyPhone"] });
      const prevState = queryClient.getQueryData(["verifyPhone"]); // 이전상태저장
      queryClient.setQueryData(["verifyPhone"], (old: any) => ({
        ...old,
        ...newData,
      })); // 입력값은 최신으로 갱신, 캐시에 있던 다른정보(이전상태)는 그대로 유지
      return { prevState };
    },
    onSuccess: (_, variables) => {
      // 요청성공시 실행
      setFieldErrors({});
      const hasToken =
        typeof variables?.token === "string" && variables.token.trim() !== "";

      if (hasToken) {
        showToast("인증되었습니다.", "success");
        return;
      }

      setToken(true);
      setFoundEmail(null);
      showToast("인증번호가 발송되었습니다.", "success");
    },
    onError: (error, _, context) => {
      // 요청실패시 실행
      if (context?.prevState) {
        queryClient.setQueryData(["verifyPhone"], context.prevState);
      }
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        const firstMessage = Object.values(error.fieldErrors)
          .flat()
          .find(Boolean);
        showToast(firstMessage || "입력값을 확인해주세요.", "error");
        return;
      }
      setFieldErrors({});
      showToast(error.message || "인증번호 발송에 실패했습니다.", "error");
    },
    onSettled: () => {
      // verifyPhone 캐시 무효화, 서버값으로 동기화
      queryClient.invalidateQueries({ queryKey: ["verifyPhone"] });
    },
  });

  const findIdMutation = useMutation<
    { success: boolean; data?: { email?: string } },
    ApiError,
    Record<string, string>
  >({
    mutationFn: (payload) => findId(payload),
    onSuccess: (data) => {
      setFieldErrors({});
      const email = data?.data?.email;
      if (email) {
        setFoundEmail(email);
        showToast("아이디를 찾았습니다.", "success");
        return;
      }
      showToast("아이디를 찾지 못했습니다.", "error");
    },
    onError: (error) => {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        const firstMessage = Object.values(error.fieldErrors)
          .flat()
          .find(Boolean);
        showToast(firstMessage || "입력값을 확인해주세요.", "error");
        return;
      }
      setFieldErrors({});
      showToast(error.message || "아이디 찾기에 실패했습니다.", "error");
    },
  });

  const passwordVerifyMutation = useMutation<
    unknown,
    ApiError,
    Record<string, string>,
    { prevState?: unknown }
  >({
    mutationFn: (userData) => verifyPhone(userData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["verifyPhone"] });
      const prevState = queryClient.getQueryData(["verifyPhone"]);
      queryClient.setQueryData(["verifyPhone"], (old: any) => ({
        ...old,
        ...newData,
      }));
      return { prevState };
    },
    onSuccess: (_, variables) => {
      setFieldErrors({});
      const tokenValue = String(variables?.token ?? "").trim();
      if (tokenValue) { // 서버에서 토큰을 받아온 경우(인증이 완료된 경우)
        setPasswordVerified(true);
        setVerifiedToken(tokenValue);
        showToast("인증되었습니다.", "success");
        return;
      }
      // 인증번호만 발송된 경우
      setPasswordTokenSent(true);
      setPasswordVerified(false);
      setVerifiedToken(null);
      showToast("인증번호가 발송되었습니다.", "success");
    },
    onError: (error, _, context) => {
      console.log(error.message);
      if (context?.prevState) {
        queryClient.setQueryData(["verifyPhone"], context.prevState);
      }
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        const firstMessage = Object.values(error.fieldErrors)
          .flat()
          .find(Boolean);
        showToast(firstMessage || "입력값을 확인해주세요.", "error");
        return;
      }
      setFieldErrors({});
      showToast(error.message || "인증번호 발송에 실패했습니다.", "error");
    },
    onSettled: () => { // 캐시 무효화, 서버값으로 동기화
      queryClient.invalidateQueries({ queryKey: ["verifyPhone"] });
       // verifyPhone 캐시 무효화, 이후 요청시 서버에서 값을 다시 받아옴
    },
  });

  const resetPasswordMutation = useMutation<
    { success: boolean },
    ApiError,
    Record<string, string>
  >({
    mutationFn: (payload) => resetPassword(payload),
    onSuccess: () => {
      setFieldErrors({});
      showToast("비밀번호가 재설정되었습니다.", "success");
      router.push("/");
    },
    onError: (error) => {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        const firstMessage = Object.values(error.fieldErrors)
          .flat()
          .find(Boolean);
        showToast(firstMessage || "입력값을 확인해주세요.", "error");
        return;
      }
      setFieldErrors({});
      showToast(error.message || "비밀번호 재설정에 실패했습니다.", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setFoundEmail(null);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const tokenValue = String(payload.token ?? "").trim();
    if (tokenValue) {
      findIdMutation.mutate(payload as Record<string, string>);
      return;
    }
    mutation.mutate(payload as Record<string, string>);
  };

  const handleResend = () => {
    if (!formRef.current) return;
    setFieldErrors({});
    const formData = new FormData(formRef.current);
    const payload = {
      phone1: String(formData.get("phone1") ?? ""),
      phone2: String(formData.get("phone2") ?? ""),
      phone3: String(formData.get("phone3") ?? ""),
      purpose: "id",
    };
    mutation.mutate(payload);
  };

  const handlePasswordRequest = () => {
    if (!passwordFormRef.current) return;
    setFieldErrors({});
    const formData = new FormData(passwordFormRef.current);
    const emailId = String(formData.get("email") ?? "").trim();
    const emailDomain = String(formData.get("domain") ?? "").trim();
    const payload = {
      email: `${emailId}@${emailDomain}`,
      name: String(formData.get("name") ?? ""),
      phone1: String(formData.get("phone1") ?? ""),
      phone2: String(formData.get("phone2") ?? ""),
      phone3: String(formData.get("phone3") ?? ""),
      purpose: "password",
    };
    passwordVerifyMutation.mutate(payload);
  };

  const handlePasswordVerify = () => {
    if (!passwordFormRef.current) return;
    setFieldErrors({});
    const formData = new FormData(passwordFormRef.current);
    const emailId = String(formData.get("email") ?? "").trim();
    const emailDomain = String(formData.get("domain") ?? "").trim();
    const payload = {
      email: `${emailId}@${emailDomain}`,
      name: String(formData.get("name") ?? ""),
      phone1: String(formData.get("phone1") ?? ""),
      phone2: String(formData.get("phone2") ?? ""),
      phone3: String(formData.get("phone3") ?? ""),
      token: String(formData.get("token") ?? ""),
      purpose: "password",
    };
    passwordVerifyMutation.mutate(payload);
  };

  const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    if (!passwordFormRef.current) return;
    const formData = new FormData(passwordFormRef.current);
    const emailId = String(formData.get("email") ?? "").trim();
    const emailDomain = String(formData.get("domain") ?? "").trim();
    const payload = {
      email: `${emailId}@${emailDomain}`,
      name: String(formData.get("name") ?? ""),
      phone1: String(formData.get("phone1") ?? ""),
      phone2: String(formData.get("phone2") ?? ""),
      phone3: String(formData.get("phone3") ?? ""),
      token: verifiedToken ?? String(formData.get("token") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    if (payload.password !== confirmPassword) {
      showToast("비밀번호가 일치하지 않습니다.", "error");
      return;
    }
    resetPasswordMutation.mutate(payload);
  };

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
              onClick={() => {
                setTab("id");
                setFieldErrors({});
                setFoundEmail(null);
              }}
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
              onClick={() => {
                setTab("password");
                setFieldErrors({});
                setPasswordTokenSent(false);
                setPasswordVerified(false);
                setVerifiedToken(null);
              }}
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
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
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
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <FormInput
                          type="text"
                          name="phone1"
                          placeholder="010"
                          maxLength={3}
                          required={true}
                          errors={fieldErrors.phone1}
                          containerClassName="mb-0!"
                        />
                        <FormInput
                          type="text"
                          name="phone2"
                          placeholder="1234"
                          maxLength={4}
                          required={true}
                          errors={fieldErrors.phone2}
                          containerClassName="mb-0!"
                        />
                        <FormInput
                          type="text"
                          name="phone3"
                          placeholder="5678"
                          maxLength={4}
                          required={true}
                          errors={fieldErrors.phone3}
                          containerClassName="mb-0!"
                        />
                        <FormButton
                          type="button"
                          loading={mutation.isPending}
                          disabled={mutation.isPending}
                          text={token ? "인증번호 재발송" : "인증번호 발송"}
                          className="text-sm"
                          onClick={handleResend}
                        />
                      </div>
                      {token ? (
                        <div className="flex items-center gap-2 w-full">
                          <FormInput
                            type="text"
                            name="token"
                            placeholder="인증번호"
                            maxLength={4}
                            required={false}
                            errors={fieldErrors.token}
                            containerClassName="mb-0!"
                          />
                          <FormButton
                            type="submit"
                            loading={mutation.isPending}
                            disabled={mutation.isPending}
                            text={"인증"}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
                {foundEmail && (
                  <div className="mt-6 rounded-xl border bg-[#fff7ee] px-6 py-5 text-center">
                    <p className="text-sm text-gray-600">회원님의 아이디는</p>
                    <p className="mt-2 text-lg font-bold text-gray-900">
                      {foundEmail}
                    </p>
                    <div className="mt-4">
                      <Link
                        href="/auth/login"
                        className="inline-flex items-center justify-center rounded-md bg-[#3b4356] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2f3646]"
                      >
                        로그인 하기
                      </Link>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <form
                ref={passwordFormRef}
                onSubmit={handlePasswordReset}
                className="space-y-5"
              >
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
                        errors={fieldErrors.email}
                        containerClassName="mb-0!"
                      />
                      <span className="text-gray-500">@</span>
                      <FormInput
                        type="text"
                        name="domain"
                        required={true}
                        placeholder="도메인"
                        errors={fieldErrors.domain}
                        containerClassName="mb-0!"
                      />
                    </div>
                    <select className="border rounded-md px-2 py-2 text-base text-gray-600 w-full sm:w-auto">
                      <option>직접입력</option>
                      <option>gmail.com</option>
                      <option>naver.com</option>
                      <option>daum.net</option>
                    </select>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {fieldErrors.email && (
                      <span className="text-red-500 font-medium">
                        {fieldErrors.email}
                      </span>
                    )}
                    {fieldErrors.domain && (
                      <span className="text-red-500 font-medium">
                        {fieldErrors.domain}
                      </span>
                    )}
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
                    errors={fieldErrors.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {passwordTokenSent ? "인증번호" : "연락처"}
                    <span className="text-red-500">✔</span>
                    <span className="text-red-500">✔</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <FormInput
                        type="text"
                        name="phone1"
                        placeholder="010"
                        required={true}
                        containerClassName="mb-0!"
                        // errors={fieldErrors.phone1}
                      />
                      <FormInput
                        type="text"
                        name="phone2"
                        placeholder="1234"
                        required={true}
                        containerClassName="mb-0!"
                        // errors={fieldErrors.phone2}
                      />
                      <FormInput
                        type="text"
                        name="phone3"
                        placeholder="5678"
                        required={true}
                        containerClassName="mb-0!"
                        // errors={fieldErrors.phone3}
                      />
                    </div>
                    <FormButton
                      type="button"
                      loading={passwordVerifyMutation.isPending}
                      disabled={passwordVerifyMutation.isPending}
                      text={passwordTokenSent ? "인증번호 재발송" : "인증요청"}
                      onClick={handlePasswordRequest}
                    />
                  </div>
                </div>
                {passwordTokenSent && (
                  <div className="flex items-center gap-2 w-full">
                    <FormInput
                      type="text"
                      name="token"
                      placeholder="인증번호"
                      maxLength={4}
                      required={false}
                      // errors={fieldErrors.token}
                      containerClassName="mb-0!"
                    />
                    <FormButton
                      type="button"
                      loading={passwordVerifyMutation.isPending}
                      disabled={passwordVerifyMutation.isPending}
                      text="인증"
                      onClick={handlePasswordVerify}
                    />
                  </div>
                )}
                {passwordVerified && (
                  <div className="rounded-xl border bg-[#f7f7f7] px-4 py-4 space-y-3">
                    <FormInput
                      type="password"
                      name="password"
                      placeholder="새 비밀번호"
                      required={true}
                      minLength={PASSWORD_MIN_LENGTH}
                      errors={fieldErrors.password}
                    />
                    <FormInput
                      type="password"
                      name="confirmPassword"
                      placeholder="새 비밀번호 확인"
                      required={true}
                      minLength={PASSWORD_MIN_LENGTH}
                      errors={fieldErrors.confirmPassword}
                    />
                    <p className="text-xs text-gray-500">
                      {PASSWORD_REGEX_ERROR}
                    </p>
                    <FormButton
                      type="submit"
                      loading={resetPasswordMutation.isPending}
                      disabled={resetPasswordMutation.isPending}
                      text="비밀번호 재설정"
                    />
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
