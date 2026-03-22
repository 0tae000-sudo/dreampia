import { TermsEditor } from "@/components/admin/terms-editor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
};

export default function AdminTermsPage() {
  return (
    <div className="mx-auto max-w-4xl pb-10">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">이용약관</h1>
        <p className="mt-1 text-sm text-gray-600">
          서비스이용약관과 개인정보취급방침을 각각 저장할 수 있습니다.
        </p>
      </div>
      <TermsEditor />
    </div>
  );
}
