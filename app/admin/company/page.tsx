import { CompanyIntroEditor } from "@/components/admin/company-intro-editor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회사소개 편집",
};

export default function AdminCompanyPage() {
  return (
    <div className="mx-auto max-w-5xl pb-10">
      <CompanyIntroEditor />
    </div>
  );
}
