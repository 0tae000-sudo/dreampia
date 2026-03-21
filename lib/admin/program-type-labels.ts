/** EventApplication.programType → 한글 라벨 */
export const PROGRAM_TYPE_LABELS: Record<string, string> = {
  JOB_LECTURE: "직업특강",
  JOB_EXPERIENCE: "직업체험",
  STUDY_CONCERT: "스터디콘서트",
  JOB_FAIR: "직업박람회",
  CAREER_CAMP: "진로캠프",
  NEW_INDUSTRY: "신산업미래직업",
  JUNGRANG_ONE_DAY: "중랑 원데이",
  CAREER_CONCERT: "진로콘서트",
  CAREER_PLAY: "진로연극",
  DIGITAL_CAMP: "디지털 탬프",
};

export function programTypeLabel(value: string): string {
  return PROGRAM_TYPE_LABELS[value] ?? value;
}
