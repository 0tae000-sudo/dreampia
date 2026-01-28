"use client";

import { useRef, useState } from "react";

import FormButton from "@/components/form-btn";
import Input from "@/components/input";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useMutation } from "@tanstack/react-query";
import { checkEmail, createAccount } from "@/lib/auth/api";
import { ApiError } from "@/lib/api-utils";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function TeacherSignup() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const mutation = useMutation<unknown, ApiError, Record<string, string>>({
    mutationFn: createAccount,
    onSuccess: () => {
      setFieldErrors({});
      alert("회원가입이 완료되었습니다.");
    },
    onError: (error) => {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        return;
      }
      setFieldErrors({});
      alert(error.message || "회원가입에 실패했습니다.");
    },
  });
  const emailCheckMutation = useMutation<unknown, ApiError, string>({
    mutationFn: checkEmail,
    onSuccess: () => {
      setFieldErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
      alert("사용 가능한 이메일입니다.");
    },
    onError: (error) => {
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
        return;
      }
      alert(error.message || "이메일 중복확인에 실패했습니다.");
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const emailLocal = String(payload.email ?? "").trim();
    const domainValue = String(payload.domain ?? "").trim();
    if (emailLocal && domainValue) {
      payload.email = `${emailLocal}@${domainValue}`;
    }
    mutation.mutate(payload as Record<string, string>);
  };

  const handleCheckEmail = () => {
    const localValue = emailLocal.trim();
    const domainValue = domain.trim();
    if (!localValue || !domainValue) {
      alert("이메일과 도메인을 입력해주세요.");
      return;
    }
    const fullEmail = `${localValue}@${domainValue}`;
    emailCheckMutation.mutate(fullEmail);
  };

  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [domain, setDomain] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const detailAddressRef = useRef<HTMLInputElement>(null);
  const domainOptions = ["gmail.com", "naver.com", "daum.net"];
  const selectedDomain = domainOptions.includes(domain) ? domain : "";
  const renderErrors = (name: string) => {
    const errors = fieldErrors[name];
    if (!errors?.length) return null;
    return errors.map((error, index) => (
      <span key={`${name}-${index}`} className="text-red-500 font-medium">
        {error}
      </span>
    ));
  };

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "")
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);
    setPostcode(data.zonecode);
    setIsAddressSearchOpen(false);
    setTimeout(() => detailAddressRef.current?.focus(), 0);
  };

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
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-2">
                학교(기관)명 <span className="text-red-500">✔</span>
              </label>
              <Input
                type="text"
                name="schoolName"
                placeholder="학교(기관)명"
                required={true}
                errors={fieldErrors.schoolName}
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
              {renderErrors("schoolLevel")}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                주소 <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    name="postcode"
                    placeholder="우편번호"
                    required={true}
                    value={postcode}
                    onChange={(event) => setPostcode(event.target.value)}
                    errors={fieldErrors.postcode}
                    readOnly={true}
                  />
                </div>
                <div className="w-full sm:w-32">
                  <button
                    className="cursor-pointer bg-orange-600 text-amber-50 rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                    type="button"
                    disabled={false}
                    onClick={() => setIsAddressSearchOpen(true)}
                  >
                    우편번호 검색
                  </button>
                </div>
              </div>
              {/* 주소 검색 모달 */}
              {isAddressSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden relative">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h2 className="font-bold">주소 검색</h2>
                      <button
                        onClick={() => setIsAddressSearchOpen(false)}
                        className="text-xl"
                      >
                        &times;
                      </button>
                    </div>
                    <DaumPostcodeEmbed
                      onComplete={handleComplete}
                      style={{ height: "450px" }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-2">
                <Input
                  type="text"
                  name="address"
                  placeholder="주소(도로명)"
                  required={true}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  errors={fieldErrors.address}
                />
              </div>
              <div className="mt-2">
                <Input
                  type="text"
                  name="detailAddress"
                  placeholder="상세주소"
                  required={true}
                  ref={detailAddressRef}
                  errors={fieldErrors.detailAddress}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                교사(담당자)명 <span className="text-red-500">✔</span>
              </label>
              <Input
                type="text"
                name="teacherName"
                placeholder="교사명"
                required={true}
                errors={fieldErrors.teacherName}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                직위 <span className="text-red-500">✔</span>
              </label>
              <Input
                type="text"
                name="position"
                placeholder="직위"
                required={true}
                errors={fieldErrors.position}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                연락처 <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                  <div className="w-20">
                    <Input
                      type="text"
                      name="phone1"
                      placeholder="010"
                      required={true}
                      errors={fieldErrors.phone1}
                    />
                  </div>
                  <Input
                    type="text"
                    name="phone2"
                    placeholder="1234"
                    required={true}
                    errors={fieldErrors.phone2}
                  />
                  <Input
                    type="text"
                    name="phone3"
                    placeholder="5678"
                    required={true}
                    errors={fieldErrors.phone3}
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
                  <Input
                    type="text"
                    name="email"
                    placeholder="이메일"
                    required={true}
                    errors={fieldErrors.email}
                    value={emailLocal}
                    onChange={(event) => setEmailLocal(event.target.value)}
                  />
                  <span className="text-gray-500">@</span>
                  <Input
                    type="text"
                    name="domain"
                    placeholder="도메인"
                    required={true}
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    errors={fieldErrors.email ? [""] : undefined}
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
                {renderErrors("domain")}
              </div>
              <div className="mt-2 w-full sm:w-36">
                <button
                  type="button"
                  className="cursor-pointer bg-orange-600 text-amber-50 rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                  onClick={handleCheckEmail}
                  disabled={
                    emailCheckMutation.isPending ||
                    !emailLocal.trim() ||
                    !domain.trim()
                  }
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
                <Input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  required={true}
                  errors={fieldErrors.password}
                  minLength={PASSWORD_MIN_LENGTH}
                />
                <Input
                  type="password"
                  name="passwordConfirm"
                  placeholder="비밀번호확인"
                  required={true}
                  errors={fieldErrors.passwordConfirm}
                  minLength={PASSWORD_MIN_LENGTH}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <div className="w-full sm:w-48">
                <FormButton
                  className="cursor-pointer"
                  type="submit"
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
