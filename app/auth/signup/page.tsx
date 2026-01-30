"use client";

import { useEffect, useMemo, useState } from "react";
import { AGREEMENTS } from "./aggrements";
import FormButton from "@/components/form-btn";
import Link from "next/link";

export default function Signup() {
  const [role, setRole] = useState<"teacher" | "mentor">("teacher");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [agreeAll, setAgreeAll] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(AGREEMENTS.map((item) => [item.id, false]))
  );

  const activeAgreementIds = useMemo(() => {
    if (role === "teacher") {
      return ["terms", "privacy"];
    }
    return ["terms", "privacy", "content", "message"];
  }, [role]);
  const activeAgreements = useMemo(
    () => AGREEMENTS.filter((item) => activeAgreementIds.includes(item.id)),
    [activeAgreementIds]
  );

  useEffect(() => {
    setChecked((prev) => {
      const next = { ...prev };
      AGREEMENTS.forEach((item) => {
        if (!activeAgreementIds.includes(item.id)) {
          next[item.id] = false;
        } else if (next[item.id] === undefined) {
          next[item.id] = false;
        }
      });
      const allChecked = activeAgreementIds.every((id) => next[id]);
      setAgreeAll(allChecked);
      return next;
    });
  }, [activeAgreementIds]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };
  const toggleAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setChecked((prev) => {
      const updated = { ...prev };
      activeAgreementIds.forEach((id) => {
        updated[id] = next;
      });
      return updated;
    });
  };
  const toggleOne = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const allChecked = activeAgreementIds.every((key) => next[key]);
      setAgreeAll(allChecked);
      return next;
    });
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
            - 회원유형선택 -
          </span>
        </div>

        {/* Role toggle cards */}
        <div className="mt-8 flex flex-row  items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setRole("teacher")}
            className={`w-32 h-32 lg:w-48 lg:h-48 border rounded-lg flex flex-col items-center justify-center gap-3 shadow-sm transition ${
              role === "teacher"
                ? "bg-[#f28c28] text-white border-[#f28c28]"
                : "bg-white text-gray-700"
            }`}
          >
            <span className="text-4xl" aria-hidden>
              🏫
            </span>
            <span className="font-bold">교사(담당자)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("mentor")}
            className={`w-32 h-32 lg:w-48 lg:h-48 border rounded-lg flex flex-col items-center justify-center gap-3 shadow-sm transition ${
              role === "mentor"
                ? "bg-[#f28c28] text-white border-[#f28c28]"
                : "bg-white text-gray-700"
            }`}
          >
            <span className="text-4xl" aria-hidden>
              👥
            </span>
            <span className="font-bold">멘토</span>
          </button>
        </div>

        {/* 안내문 */}
        <section className="mt-8">
          <h3 className="text-lg font-black border-b-2 border-[#e35b2f] inline-block pb-1">
            {role === "mentor"
              ? "멘토 회원 가입 안내문"
              : "교사(담당자) 회원 가입 안내문"}
          </h3>
          <div className="mt-4 bg-[#fff6ea] border border-[#f0e0c9] rounded-md p-4 text-sm text-gray-700 leading-6">
            {role === "mentor" ? (
              <>
                <p>
                  - 미래를 꿈꾸는 청소년들에게 멘토님의 소중한 경험을
                  선물해주세요.
                </p>
                <p>
                  - 멘토 회원으로 가입하시면, 다양한 진로교육 프로그램에
                  참여하여 청소년의 꿈과 미래를 만나볼 수 있습니다.
                </p>
                <p>
                  - 회원가입은 간단합니다. 기본 정보를 입력하고 가입을
                  완료하시면, 프로그램에 대한 안내를 받아보실 수 있습니다.
                </p>
              </>
            ) : (
              <>
                <p>
                  - 학생들에게 다양한 진로교육의 기회를 제공하고 싶으신가요?
                </p>
                <p>
                  - 달꿈 교사 회원으로 가입하시면, 손쉽게 프로그램을 예약하고
                  맞춤형 교육 자료와 이벤트 소식을 받아보실 수 있습니다.
                </p>
                <p>
                  - 가입 절차는 간단합니다. 기본 정보를 입력하고 회원가입을
                  완료하시면, 교사 전용 프로그램 정보를 편리하게 이용하실 수
                  있습니다.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Agreements */}
        <section className="mt-8 space-y-3">
          <button
            type="button"
            onClick={toggleAll}
            className="w-full flex items-center gap-3 bg-gray-200 text-gray-700 px-4 py-3 rounded-md font-semibold"
          >
            <input
              type="checkbox"
              className="w-5 h-5 accent-[#e35b2f]"
              checked={agreeAll}
              onChange={toggleAll}
            />
            회원가입약관 전체동의
          </button>

          {activeAgreements.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[#e35b2f]"
                    checked={checked[item.id] ?? false}
                    onChange={() => toggleOne(item.id)}
                  />
                  {item.title}
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpanded(item.id)}
                  className="text-xs text-[#e35b2f] font-bold"
                >
                  보기
                </button>
              </div>
              {expanded === item.id ? (
                <div className="px-4 pb-4 text-xs text-gray-600 whitespace-pre-line leading-6 max-h-[200px] overflow-y-auto">
                  {item.body}
                </div>
              ) : null}
            </div>
          ))}
        </section>

        <div className="mt-8 flex justify-center">
          {role === "mentor" ? (
            <Link href="/auth/signup/mentor" className="w-full">
              <FormButton
                type="button"
                loading={false}
                disabled={false}
                text="멘토 회원 가입"
              />
            </Link>
          ) : (
            <Link href="/auth/signup/teacher" className="w-full">
              <FormButton
                type="button"
                loading={false}
                disabled={false}
                text="교사 회원 가입"
              />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
