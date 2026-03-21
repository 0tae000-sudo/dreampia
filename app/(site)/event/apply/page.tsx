"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import DaumPostcodeEmbed from "react-daum-postcode";
import { getCurrentUser } from "@/lib/auth/api";
import Input from "@/components/input";
import { ApiError } from "@/lib/api-utils";

type User = {
  isTeacher: boolean | null;
};

export default function EventApplyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const detailAddressRef = useRef<HTMLInputElement>(null);
  const [timeSlots, setTimeSlots] = useState([
    {
      period: "1",
      startHour: "09",
      startMinute: "00",
      endHour: "09",
      endMinute: "50",
    },
  ]);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [providedItems, setProvidedItems] = useState<string[]>([]);

  const gradeOptions = useMemo(() => [1, 2, 3, 4, 5, 6], []);
  const providedOptions = useMemo(() => ["데스크탑", "노트북", "전자칠판"], []);
  const periodOptions = useMemo(
    () => Array.from({ length: 9 }, (_, idx) => String(idx + 1)),
    [],
  );
  const hourOptions = useMemo(
    () =>
      Array.from({ length: 23 }, (_, idx) => String(idx + 1).padStart(2, "0")),
    [],
  );
  const minuteOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, idx) => String(idx * 5).padStart(2, "0")),
    [],
  );

  useEffect(() => {
    let isMounted = true;
    const checkAccess = async () => {
      try {
        const payload = await getCurrentUser();
        const user = payload?.data as User | undefined;
        if (!user?.isTeacher) {
          alert("학교(기관) 회원만 행사접수가 가능합니다.");
          router.replace("/");
          return;
        }
      } catch {
        router.replace("/auth/login");
        return;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    checkAccess();
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleComplete = (data: {
    zonecode: string;
    address: string;
    addressType: string;
    bname: string;
    buildingName: string;
  }) => {
    setPostcode(data.zonecode);
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;
      }
      fullAddress += extraAddress ? ` (${extraAddress})` : "";
    }
    setAddress(fullAddress);
    setIsAddressSearchOpen(false);
    requestAnimationFrame(() => detailAddressRef.current?.focus());
  };

  const renderErrors = (name: string) => {
    const errors = fieldErrors[name];
    if (!errors?.length) return null;
    return errors.map((error, index) => (
      <span key={`${name}-${index}`} className="text-red-500 font-medium">
        {error}
      </span>
    ));
  };

  const renderGroupErrors = (names: string[]) => {
    const items = names.flatMap((name) =>
      (fieldErrors[name] ?? []).map((error, index) => ({
        key: `${name}-${index}`,
        error,
      })),
    );
    if (!items.length) return null;
    return items.map((item) => (
      <span key={item.key} className="text-red-500 font-medium">
        {item.error}
      </span>
    ));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    try {
      const response = await fetch("/www/events/apply/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          postcode,
          address,
          targetGrades: selectedGrades,
          providedItems,
          timeSlots,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        const message = result?.message ?? "접수에 실패했습니다.";
        const fieldErr =
          result?.error && typeof result.error === "object"
            ? (result.error as Record<string, string[]>)
            : undefined;
        throw { message, fieldErrors: fieldErr } satisfies ApiError;
      }
      alert("행사 접수가 완료되었습니다.");
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.fieldErrors) {
        setFieldErrors(apiError.fieldErrors);
        return;
      }
      alert(apiError.message || "접수에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-gray-900">
      <section className="relative h-[200px] md:h-[240px] bg-[#3b4356] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop"
          alt="event apply banner"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-white text-center">
          <p className="text-2xl md:text-3xl font-black tracking-[0.2em]">
            MARS 프로그램 신청
          </p>
          <p className="mt-3 text-[#f2b644] font-bold tracking-[0.3em] text-sm md:text-base">
            MARS MAKE A REAL STORY
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="text-center">
          <span className="inline-block bg-[#e35b2f] text-white text-sm font-bold px-10 py-2 rounded">
            - 행사접수 안내문 -
          </span>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <div className="rounded-md bg-[#fff7ed] border border-[#fed7aa] px-4 py-3 text-sm text-gray-700">
            <p className="font-bold">[진로교육 프로그램 신청 안내]</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              신청 내용을 확인 후 담당자가 연락드립니다. 기재된 정보가 정확하지
              않으면 접수가 지연될 수 있습니다.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <section className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-bold text-sm">
                학교 정보
              </div>
              <div className="p-4 space-y-4">
                <Input
                  type="text"
                  name="schoolName"
                  placeholder="학교(기관)명"
                  required={true}
                  errors={fieldErrors.schoolName}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <select
                      name="schoolLevel"
                      required
                      className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                    >
                      <option value="">학교급 선택</option>
                      <option value="ELEMENTARY">초등</option>
                      <option value="MIDDLE">중등</option>
                      <option value="HIGH">고등</option>
                      <option value="INSTITUTE">기관</option>
                    </select>
                    {renderErrors("schoolLevel")}
                  </div>
                  <Input
                    type="text"
                    name="postcode"
                    placeholder="우편번호"
                    required={true}
                    value={postcode}
                    onChange={(event) => setPostcode(event.target.value)}
                    readOnly={true}
                    onClick={() => setIsAddressSearchOpen(true)}
                    containerClassName="mb-0!"
                    errors={fieldErrors.postcode}
                  />
                </div>
                <Input
                  type="text"
                  name="address"
                  placeholder="주소"
                  required={true}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  readOnly={true}
                  onClick={() => setIsAddressSearchOpen(true)}
                  errors={fieldErrors.address}
                />
                <Input
                  type="text"
                  name="detailAddress"
                  placeholder="상세주소"
                  required={true}
                  ref={detailAddressRef}
                  errors={fieldErrors.detailAddress}
                />
              </div>
            </section>

            <section className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-bold text-sm">
                담당자 정보
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="managerName"
                  placeholder="담당자 이름"
                  required={true}
                  errors={fieldErrors.managerName}
                />
                <Input
                  type="text"
                  name="managerPosition"
                  placeholder="직위"
                  required={true}
                  errors={fieldErrors.managerPosition}
                />
                <Input
                  type="text"
                  name="managerPhone"
                  placeholder="연락처"
                  required={true}
                  errors={fieldErrors.managerPhone}
                />
                <Input
                  type="email"
                  name="managerEmail"
                  placeholder="이메일 주소"
                  required={true}
                  errors={fieldErrors.managerEmail}
                />
              </div>
            </section>

            <section className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-bold text-sm">
                행정실 정보
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="adminName"
                  placeholder="행정실 이름"
                  required={true}
                  errors={fieldErrors.adminName}
                />
                <Input
                  type="text"
                  name="adminPosition"
                  placeholder="직위"
                  required={true}
                  errors={fieldErrors.adminPosition}
                />
                <Input
                  type="text"
                  name="adminPhone"
                  placeholder="연락처"
                  required={true}
                  errors={fieldErrors.adminPhone}
                />
                <Input
                  type="email"
                  name="adminEmail"
                  placeholder="이메일 주소"
                  required={true}
                  errors={fieldErrors.adminEmail}
                />
              </div>
            </section>

            <section className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-bold text-sm">
                행사 정보
              </div>
              <div className="p-4 space-y-4">
                <Input
                  type="text"
                  name="eventName"
                  placeholder="행사명"
                  required={true}
                  errors={fieldErrors.eventName}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <select
                      name="programType"
                      required
                      className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                    >
                      <option value="">프로그램 종류 선택</option>
                      <option value="JOB_LECTURE">직업특강</option>
                      <option value="JOB_EXPERIENCE">직업체험</option>
                      <option value="STUDY_CONCERT">스터디콘서트</option>
                      <option value="JOB_FAIR">직업박람회</option>
                      <option value="CAREER_CAMP">진로캠프</option>
                      <option value="NEW_INDUSTRY">신산업미래직업</option>
                      <option value="JUNGRANG_ONE_DAY">중랑 원데이</option>
                      <option value="CAREER_CONCERT">진로콘서트</option>
                      <option value="CAREER_PLAY">진로연극</option>
                      <option value="DIGITAL_CAMP">디지털 탬프</option>
                    </select>
                    {renderErrors("programType")}
                  </div>
                  <Input
                    type="date"
                    name="eventDate"
                    required={true}
                    errors={fieldErrors.eventDate}
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">대상학년</p>
                  <div className="flex flex-wrap gap-3">
                    {gradeOptions.map((grade) => (
                      <label
                        key={grade}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGrades.includes(grade)}
                          onChange={(event) => {
                            setSelectedGrades((prev) =>
                              event.target.checked
                                ? [...prev, grade]
                                : prev.filter((item) => item !== grade),
                            );
                          }}
                        />
                        {grade}학년
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {renderErrors("targetGrades")}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    name="totalStudents"
                    placeholder="총참여학생수"
                    required={true}
                    min={0}
                    errors={fieldErrors.totalStudents}
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">차시당 학생변경</p>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="studentChangeType"
                        value="CHANGE_PER_PERIOD"
                      />
                      교시마다 학생이 바뀝니다
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="studentChangeType"
                        value="NO_CHANGE"
                      />
                      변경없음
                    </label>
                    <div className="flex flex-col gap-1">
                      {renderErrors("studentChangeType")}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold">행사 시간</p>
                  <div className="hidden sm:grid grid-cols-[80px_1fr_1fr_1fr_1fr_auto] gap-2 text-xs text-gray-500 font-semibold px-1">
                    <span>교시선택</span>
                    <span>시작(시)</span>
                    <span>시작(분)</span>
                    <span>종료(시)</span>
                    <span>종료(분)</span>
                    <span className="text-right">관리</span>
                  </div>
                  {timeSlots.map((slot, index) => (
                    <div
                      key={`slot-${index}`}
                      className="grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr_1fr_1fr_auto] gap-2 items-center justify-center"
                    >
                      <select
                        name={`period-${index}`}
                        value={slot.period}
                        onChange={(event) =>
                          setTimeSlots((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, period: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                      >
                        {periodOptions.map((period) => (
                          <option key={period} value={period}>
                            {period}교시
                          </option>
                        ))}
                      </select>
                      <select
                        name={`startHour-${index}`}
                        value={slot.startHour}
                        onChange={(event) =>
                          setTimeSlots((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, startHour: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                      >
                        {hourOptions.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}시
                          </option>
                        ))}
                      </select>
                      <select
                        name={`startMinute-${index}`}
                        value={slot.startMinute}
                        onChange={(event) =>
                          setTimeSlots((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, startMinute: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                      >
                        {minuteOptions.map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}분
                          </option>
                        ))}
                      </select>
                      <select
                        name={`endHour-${index}`}
                        value={slot.endHour}
                        onChange={(event) =>
                          setTimeSlots((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, endHour: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                      >
                        {hourOptions.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}시
                          </option>
                        ))}
                      </select>
                      <select
                        name={`endMinute-${index}`}
                        value={slot.endMinute}
                        onChange={(event) =>
                          setTimeSlots((prev) =>
                            prev.map((item, idx) =>
                              idx === index
                                ? { ...item, endMinute: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                      >
                        {minuteOptions.map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}분
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          className="px-3 h-10 rounded-md bg-blue-600 text-white text-xs font-semibold"
                          onClick={() =>
                            setTimeSlots((prev) => [
                              ...prev,
                              {
                                period: String(prev.length + 1),
                                startHour: "09",
                                startMinute: "00",
                                endHour: "09",
                                endMinute: "50",
                              },
                            ])
                          }
                        >
                          추가
                        </button>
                        {timeSlots.length > 1 && (
                          <button
                            type="button"
                            className="px-3 h-10 rounded-md bg-gray-200 text-gray-700 text-xs font-semibold"
                            onClick={() =>
                              setTimeSlots((prev) =>
                                prev.filter((_, idx) => idx !== index),
                              )
                            }
                          >
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-1">
                    {renderErrors("timeSlots")}
                  </div>
                </div>
              </div>
            </section>

            <section className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-bold text-sm">
                멘토 정보
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="number"
                  name="mentorRequestCount"
                  placeholder="요청 멘토 수"
                  required={true}
                  errors={fieldErrors.mentorRequestCount}
                />
                <Input
                  type="text"
                  name="mentorPreference"
                  placeholder="멘토대기실"
                  errors={fieldErrors.mentorPreference}
                />
              </div>
            </section>

            <section className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 font-bold text-sm">
                기타 정보
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">학교 제공 사항</p>
                  <div className="flex flex-wrap gap-3">
                    {providedOptions.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={providedItems.includes(item)}
                          onChange={(event) => {
                            setProvidedItems((prev) =>
                              event.target.checked
                                ? [...prev, item]
                                : prev.filter((value) => value !== item),
                            );
                          }}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
                <Input
                  type="text"
                  name="expectedQuote"
                  placeholder="예상 견적"
                  errors={fieldErrors.expectedQuote}
                />
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    문의/요청사항
                  </label>
                  <textarea
                    name="inquiry"
                    rows={4}
                    className="bg-transparent rounded-md w-full focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border px-3 py-2 text-base"
                  />
                  <div className="mt-2 flex flex-col gap-1">
                    {renderErrors("inquiry")}
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#e35b2f] text-white px-8 py-3 rounded-md font-bold"
              >
                행사 신청 등록
              </button>
            </div>
          </form>
        </div>
      </main>

      {isAddressSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg overflow-hidden relative">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold">주소 검색</h2>
              <button
                type="button"
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
    </div>
  );
}
