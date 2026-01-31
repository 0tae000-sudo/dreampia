"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import FormButton from "@/components/form-btn";
import Input from "@/components/input";
import { jobs } from "@/lib/constants";
import { checkEmail, createAccount } from "@/lib/auth/api";
import { ApiError } from "@/lib/api-utils";

type CareerItem = {
  period: string;
  role: string;
  company: string;
};

type CertificateItem = {
  date: string;
  name: string;
  issuer: string;
};

type AwardItem = {
  date: string;
  title: string;
  organization: string;
};

type LectureItem = {
  period: string;
  title: string;
  organization: string;
};

type JobDetail = {
  career: CareerItem[];
  certificates: CertificateItem[];
  awards: AwardItem[];
  lectures: LectureItem[];
};

const createEmptyDetails = (): JobDetail => ({
  career: [{ period: "", role: "", company: "" }],
  certificates: [{ date: "", name: "", issuer: "" }],
  awards: [{ date: "", title: "", organization: "" }],
  lectures: [{ period: "", title: "", organization: "" }],
});

export default function MentorSignup() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const mutation = useMutation<unknown, ApiError, Record<string, any>>({
    mutationFn: createAccount,
    onSuccess: () => {
      setFieldErrors({});
      alert("회원가입이 완료되었습니다.");
      router.push("/profile");
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
  const [domain, setDomain] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [activeJobIndex, setActiveJobIndex] = useState<number | null>(null);
  const [jobSearch, setJobSearch] = useState("");
  const [jobSelections, setJobSelections] = useState<string[]>(["", "", ""]);
  const [jobDetails, setJobDetails] = useState<JobDetail[]>([
    createEmptyDetails(),
    createEmptyDetails(),
    createEmptyDetails(),
  ]);

  const filteredJobs = useMemo(() => {
    const keyword = jobSearch.trim();
    if (!keyword) return jobs;
    return jobs.filter((job) => job.includes(keyword));
  }, [jobSearch]);

  const openJobModal = (index: number) => {
    setActiveJobIndex(index);
    setJobModalOpen(true);
  };

  const closeJobModal = () => {
    setJobModalOpen(false);
    setJobSearch("");
    setActiveJobIndex(null);
  };

  const handleSelectJob = (job: string) => {
    if (activeJobIndex === null) return;
    setJobSelections((prev) =>
      prev.map((value, idx) => (idx === activeJobIndex ? job : value)),
    );
    closeJobModal();
  };

  const updateDetail = <
    Section extends keyof JobDetail,
    Field extends keyof JobDetail[Section][number],
  >(
    jobIndex: number,
    section: Section,
    lineIndex: number,
    field: Field,
    value: string,
  ) => {
    setJobDetails((prev) =>
      prev.map((detail, idx) => {
        if (idx !== jobIndex) return detail;
        return {
          ...detail,
          [section]: detail[section].map((line, lineIdx) =>
            lineIdx === lineIndex ? { ...line, [field]: value } : line,
          ),
        };
      }),
    );
  };

  const addDetailLine = (jobIndex: number, section: keyof JobDetail) => {
    setJobDetails((prev) =>
      prev.map((detail, idx) => {
        if (idx !== jobIndex) return detail;
        if (section === "career") {
          return {
            ...detail,
            career: [...detail.career, { period: "", role: "", company: "" }],
          };
        }
        if (section === "certificates") {
          return {
            ...detail,
            certificates: [
              ...detail.certificates,
              { date: "", name: "", issuer: "" },
            ],
          };
        }
        if (section === "awards") {
          return {
            ...detail,
            awards: [
              ...detail.awards,
              { date: "", title: "", organization: "" },
            ],
          };
        }
        return {
          ...detail,
          lectures: [
            ...detail.lectures,
            { period: "", title: "", organization: "" },
          ],
        };
      }),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<
      string,
      any
    >;
    const emailLocalValue = String(payload.email ?? "").trim();
    const domainValue = String(payload.domain ?? "").trim();
    if (emailLocalValue && domainValue) {
      payload.email = `${emailLocalValue}@${domainValue}`;
    }
    payload.jobs = jobSelections
      .map((title, index) => ({
        title,
        ...jobDetails[index],
      }))
      .filter((job) => typeof job.title === "string" && job.title.trim());
    mutation.mutate(payload);
  };

  const handleCheckEmail = () => {
    const localValue = emailLocal.trim();
    const domainValue = domain.trim();
    if (!localValue || !domainValue) {
      alert("이메일과 도메인을 입력해주세요.");
      return;
    }
    emailCheckMutation.mutate(`${localValue}@${domainValue}`);
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
        <span className="inline-block bg-[#e35b2f] text-white text-sm font-bold px-10 py-2 rounded">
            - 회원정보입력 -
          </span>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6 md:p-8">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                아이디(이메일){" "}
                <span className="text-xs text-gray-500">*추후 변경 불가</span>{" "}
                <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 w-full lg:mb-4">
                  <Input
                    type="text"
                    name="email"
                    placeholder="아이디"
                    required={true}
                    value={emailLocal}
                    onChange={(event) => setEmailLocal(event.target.value)}
                    errors={fieldErrors.email}
                    containerClassName="mb-0!"
                  />
                  <span className="text-gray-500">@</span>
                  <Input
                    type="text"
                    name="domain"
                    placeholder="도메인"
                    required={true}
                    value={domain}
                    onChange={(event) => setDomain(event.target.value)}
                    errors={fieldErrors.domain}
                    containerClassName="mb-0!"
                  />
                </div>
                <div className="w-full sm:w-28">
                  <FormButton
                    type="button"
                    loading={false}
                    disabled={false}
                    text="중복확인"
                    onClick={handleCheckEmail}
                  />
                </div>
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
                  containerClassName="mb-0! lg:mb-4!"
                  
                />
                <Input
                  type="password"
                  name="passwordConfirm"
                  placeholder="비밀번호확인"
                  required={true}
                  errors={fieldErrors.passwordConfirm}
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
              <Input
                type="text"
                name="name"
                placeholder="이름"
                required={true}
                errors={fieldErrors.name}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                연락처 <span className="text-red-500">✔</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                    <Input
                      type="text"
                      name="phone1"
                      placeholder="010"
                      required={true}
                      errors={fieldErrors.phone1}
                      containerClassName="mb-0!"
                    />
                  
                  <Input
                    type="text"
                    name="phone2"
                    placeholder="1234"
                    required={true}
                    errors={fieldErrors.phone2}
                    containerClassName="mb-0!"
                  />
                  <Input
                    type="text"
                    name="phone3"
                    placeholder="5678"
                    required={true}
                    errors={fieldErrors.phone3}
                    containerClassName="mb-0!"
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

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                가입경로 <span className="text-red-500">✔</span>
              </label>
              <select
                name="howcome"
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <Input
                  type="text"
                  name="graduationYear"
                  placeholder="졸업연도"
                  required={true}
                  errors={fieldErrors.graduationYear}
                  containerClassName="mb-0! lg:mb-4!"
                />
                <Input
                  type="text"
                  name="schoolName"
                  placeholder="학교명"
                  required={true}
                  errors={fieldErrors.schoolName}
                  containerClassName="mb-0! lg:mb-4!"
                />
                <Input
                  type="text"
                  name="major"
                  placeholder="전공"
                  required={true}
                  errors={fieldErrors.major}
                  containerClassName="mb-0! lg:mb-4!"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                한줄 자기소개 <span className="text-red-500">✔</span>
              </label>
              <Input
                type="text"
                name="selfIntroduction"
                placeholder="한줄 자기소개"
                required={true}
                errors={fieldErrors.selfIntroduction}
              />
            </div>
          </div>

          <div className="mt-6 bg-[#eef2ff] border border-[#d9e1ff] rounded-md px-4 py-3 text-sm text-gray-700">
          <span className="text-red-500 font-bold">!</span>{" "}
          직업멘토링/직업체험을 위한 멘토님의 직업을 등록해주세요. (1개 필수,
          최대 3개 등록 가능)
          </div>

          <div className="mt-6 space-y-4">
          {[1, 2, 3].map((idx) => {
            const jobIndex = idx - 1;
            const selectedJob = jobSelections[jobIndex];
            const details = jobDetails[jobIndex];
            return (
            <div key={idx} className="bg-white rounded-md border p-4">
              <p className="font-bold text-sm mb-2">
                직업{idx} <span className="text-red-500">✔</span>
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    name={`job${idx}`}
                    placeholder="직업검색"
                    required={idx === 1}
                    readOnly={true}
                    value={selectedJob}
                    onClick={() => openJobModal(jobIndex)}
                    containerClassName="mb-0!"
                  />
                </div>
                <div className="w-full sm:w-24">
                  <FormButton
                    type="button"
                    loading={false}
                    disabled={false}
                    text="검색"
                    onClick={() => openJobModal(jobIndex)}
                  />
                </div>
              </div>
              {selectedJob && (
                <div className="mt-4 space-y-4">
                  <div className="bg-[#eef2ff] border border-[#d9e1ff] rounded-md px-4 py-3">
                    <p className="font-bold text-sm">경력사항</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">근무기간(ex. 2002.02 ~ 2004.03)</span>, 담당업무, 회사명 및 부서를 적어주세요.
                    </p>
                    <div className="mt-3 space-y-3">
                      {details.career.map((line, lineIndex) => (
                        <div
                          key={`career-${lineIndex}`}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                        >
                          <Input
                            type="text"
                            name={`careerPeriod-${idx}-${lineIndex}`}
                            placeholder="근무기간"
                            value={line.period}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "career",
                                lineIndex,
                                "period",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`careerRole-${idx}-${lineIndex}`}
                            placeholder="담당업무"
                            value={line.role}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "career",
                                lineIndex,
                                "role",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`careerCompany-${idx}-${lineIndex}`}
                            placeholder="회사명 및 부서"
                            value={line.company}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "career",
                                lineIndex,
                                "company",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 w-full sm:w-28">
                      <FormButton
                        type="button"
                        loading={false}
                        disabled={false}
                        text="라인추가"
                        onClick={() => addDetailLine(jobIndex, "career")}
                      />
                    </div>
                  </div>

                  <div className="bg-[#eef2ff] border border-[#d9e1ff] rounded-md px-4 py-3">
                    <p className="font-bold text-sm">자격증</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">발급일(ex. 2002.02.03)</span>, 자격증명, 발급기관을 적어주세요.
                    </p>
                    <div className="mt-3 space-y-3">
                      {details.certificates.map((line, lineIndex) => (
                        <div
                          key={`cert-${lineIndex}`}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                        >
                          <Input
                            type="text"
                            name={`certDate-${idx}-${lineIndex}`}
                            placeholder="발급일"
                            value={line.date}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "certificates",
                                lineIndex,
                                "date",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`certName-${idx}-${lineIndex}`}
                            placeholder="자격증명"
                            value={line.name}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "certificates",
                                lineIndex,
                                "name",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`certIssuer-${idx}-${lineIndex}`}
                            placeholder="발급기관"
                            value={line.issuer}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "certificates",
                                lineIndex,
                                "issuer",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 w-full sm:w-28">
                      <FormButton
                        type="button"
                        loading={false}
                        disabled={false}
                        text="라인추가"
                        onClick={() => addDetailLine(jobIndex, "certificates")}
                      />
                    </div>
                  </div>

                  <div className="bg-[#eef2ff] border border-[#d9e1ff] rounded-md px-4 py-3">
                    <p className="font-bold text-sm">수상경력</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">수상일(ex. 2002.02.03)</span>, 수상명, 수상기관을 적어주세요.
                    </p>
                    <div className="mt-3 space-y-3">
                      {details.awards.map((line, lineIndex) => (
                        <div
                          key={`award-${lineIndex}`}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                        >
                          <Input
                            type="text"
                            name={`awardDate-${idx}-${lineIndex}`}
                            placeholder="수상일"
                            value={line.date}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "awards",
                                lineIndex,
                                "date",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`awardTitle-${idx}-${lineIndex}`}
                            placeholder="수상명"
                            value={line.title}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "awards",
                                lineIndex,
                                "title",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`awardOrg-${idx}-${lineIndex}`}
                            placeholder="수상기관"
                            value={line.organization}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "awards",
                                lineIndex,
                                "organization",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 w-full sm:w-28">
                      <FormButton
                        type="button"
                        loading={false}
                        disabled={false}
                        text="라인추가"
                        onClick={() => addDetailLine(jobIndex, "awards")}
                      />
                    </div>
                  </div>

                  <div className="bg-[#eef2ff] border border-[#d9e1ff] rounded-md px-4 py-3">
                    <p className="font-bold text-sm">강의경력</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-red-500">강의기간(ex. 30일)</span>, 강의명, 기관을 적어주세요.
                    </p>
                    <div className="mt-3 space-y-3">
                      {details.lectures.map((line, lineIndex) => (
                        <div
                          key={`lecture-${lineIndex}`}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                        >
                          <Input
                            type="text"
                            name={`lecturePeriod-${idx}-${lineIndex}`}
                            placeholder="강의기간"
                            value={line.period}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "lectures",
                                lineIndex,
                                "period",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`lectureTitle-${idx}-${lineIndex}`}
                            placeholder="강의명"
                            value={line.title}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "lectures",
                                lineIndex,
                                "title",
                                event.target.value,
                              )
                            }
                          />
                          <Input
                            type="text"
                            name={`lectureOrg-${idx}-${lineIndex}`}
                            placeholder="기관"
                            value={line.organization}
                            onChange={(event) =>
                              updateDetail(
                                jobIndex,
                                "lectures",
                                lineIndex,
                                "organization",
                                event.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 w-full sm:w-28">
                      <FormButton
                        type="button"
                        loading={false}
                        disabled={false}
                        text="라인추가"
                        onClick={() => addDetailLine(jobIndex, "lectures")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )})}
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
              type="submit"
              loading={false}
              disabled={false}
              text="회원가입"
            />
          </div>
          </div>
        </form>
      </main>

      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-bold">직업 검색</h2>
              <button
                type="button"
                onClick={closeJobModal}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                닫기
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <Input
                type="text"
                name="jobSearch"
                placeholder="직업명 검색"
                value={jobSearch}
                onChange={(event) => setJobSearch(event.target.value)}
              />
              <div className="max-h-[420px] overflow-y-auto border rounded-md">
                <div className="grid grid-cols-1 gap-2 p-3">
                  {filteredJobs.length === 0 && (
                    <p className="text-sm text-gray-500">
                      검색 결과가 없습니다.
                    </p>
                  )}
                  {filteredJobs.map((job) => (
                    <div
                      key={job}
                      className="flex items-center justify-between gap-4 border rounded-md px-3 py-2"
                    >
                      <span className="text-sm font-medium">{job}</span>
                      <button
                        type="button"
                        className="px-3 py-1 text-xs font-semibold text-white bg-[#3b5bdb] rounded-md hover:bg-[#2f4bb5]"
                        onClick={() => handleSelectJob(job)}
                      >
                        선택
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
