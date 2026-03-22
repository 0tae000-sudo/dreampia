"use client";

import { useState } from "react";

export type MentorRequestReviewDefaults = {
  name: string;
  phone: string;
  address: string;
  job1: string;
  job2: string;
  job3: string;
  email: string;
  /** YYYYMMDD 또는 표시용 문자열 */
  birthDate: string;
  existingProfileZipName: string;
  modifiedProfileZipName: string;
  modificationMessage: string;
};

type Props = {
  requestId: string;
  defaults: MentorRequestReviewDefaults;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:items-center sm:gap-4">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div>{children}</div>
    </div>
  );
}

export function MentorRequestReviewForm({ requestId, defaults }: Props) {
  const [name, setName] = useState(defaults.name);
  const [phone, setPhone] = useState(defaults.phone);
  const [address, setAddress] = useState(defaults.address);
  const [job1, setJob1] = useState(defaults.job1);
  const [job2, setJob2] = useState(defaults.job2);
  const [job3, setJob3] = useState(defaults.job3);
  const [email, setEmail] = useState(defaults.email);
  const [birthDate, setBirthDate] = useState(defaults.birthDate);

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-500">요청 ID: {requestId}</p>

      {/* 상단: 관리자가 수정 가능한 폼 */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-base font-bold text-gray-900">멘토 정보</h2>
        <div className="space-y-4">
          <Field label="이름">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-xl rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
          <Field label="전화번호">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full max-w-xl rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
          <Field label="주소">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full max-w-2xl rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
          <Field label="직업1">
            <input
              type="text"
              value={job1}
              onChange={(e) => setJob1(e.target.value)}
              className="w-full max-w-xl rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
          <Field label="직업2">
            <input
              type="text"
              value={job2}
              onChange={(e) => setJob2(e.target.value)}
              className="w-full max-w-xl rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
          <Field label="직업3">
            <input
              type="text"
              value={job3}
              onChange={(e) => setJob3(e.target.value)}
              className="w-full max-w-xl rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
          <Field label="이메일">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-xl rounded-md border border-gray-300 px-3 py-2 text-sm text-[#4e73df] shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
          <Field label="생년월일">
            <input
              type="text"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="YYYYMMDD"
              className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            />
          </Field>
        </div>
      </section>

      {/* 중단: ZIP 프로필 비교 */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="sr-only">프로필 서류</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50/80 p-6">
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              기존 프로필
            </h3>
            <p className="font-mono text-sm text-gray-800">
              {defaults.existingProfileZipName}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              멘토 제출 ZIP 파일 (다운로드 연동 예정)
            </p>
          </div>
          <div className="rounded-md border border-dashed border-[#4e73df]/40 bg-[#4e73df]/5 p-6">
            <h3 className="mb-4 text-sm font-bold text-gray-900">
              수정 프로필
            </h3>
            <p className="font-mono text-sm text-gray-800">
              {defaults.modifiedProfileZipName}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              멘토 제출 ZIP 파일 (다운로드 연동 예정)
            </p>
          </div>
        </div>
      </section>

      {/* 하단: 수정 요청 메시지 + 버튼 */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-sm font-bold text-gray-900">수정 내용</h3>
        <textarea
          readOnly
          value={defaults.modificationMessage}
          rows={5}
          className="w-full resize-y rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800"
          aria-label="멘토 수정 요청 메시지"
        />

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            수락
          </button>
          <button
            type="button"
            className="rounded-md border-2 border-red-600 bg-white px-6 py-2.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            반려
          </button>
        </div>
      </section>
    </div>
  );
}
