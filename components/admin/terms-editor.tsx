"use client";

import { useCallback, useEffect, useState } from "react";

export function TermsEditor() {
  const [serviceTerms, setServiceTerms] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingService, setSavingService] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [msgService, setMsgService] = useState<string | null>(null);
  const [msgPrivacy, setMsgPrivacy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/admin/terms", { credentials: "include" });
      const data = (await res.json()) as {
        success?: boolean;
        serviceTerms?: string;
        privacyPolicy?: string;
        error?: string;
      };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "불러오기 실패");
      }
      setServiceTerms(data.serviceTerms ?? "");
      setPrivacyPolicy(data.privacyPolicy ?? "");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveService = async () => {
    setMsgService(null);
    setSavingService(true);
    try {
      const res = await fetch("/api/admin/terms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "service", content: serviceTerms }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "저장 실패");
      }
      setMsgService("저장되었습니다.");
    } catch (e) {
      setMsgService(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSavingService(false);
    }
  };

  const savePrivacy = async () => {
    setMsgPrivacy(null);
    setSavingPrivacy(true);
    try {
      const res = await fetch("/api/admin/terms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "privacy", content: privacyPolicy }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "저장 실패");
      }
      setMsgPrivacy("저장되었습니다.");
    } catch (e) {
      setMsgPrivacy(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSavingPrivacy(false);
    }
  };

  if (loadError) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {loadError}
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 서비스이용약관 */}
      <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
          <h2 className="text-lg font-bold text-gray-900">서비스이용약관</h2>
          <div className="flex items-center gap-3">
            {msgService && (
              <span
                className={`text-sm ${msgService.includes("실패") || msgService.includes("권한") ? "text-red-600" : "text-emerald-600"}`}
              >
                {msgService}
              </span>
            )}
            <button
              type="button"
              onClick={saveService}
              disabled={savingService}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {savingService ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <textarea
            value={serviceTerms}
            onChange={(e) => setServiceTerms(e.target.value)}
            className="min-h-[360px] w-full resize-y rounded-md border border-gray-300 px-3 py-3 text-sm leading-relaxed text-gray-900 shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            spellCheck={false}
            aria-label="서비스이용약관 본문"
          />
        </div>
      </section>

      {/* 개인정보취급방침 */}
      <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
          <h2 className="text-lg font-bold text-gray-900">
            개인정보취급방침
          </h2>
          <div className="flex items-center gap-3">
            {msgPrivacy && (
              <span
                className={`text-sm ${msgPrivacy.includes("실패") || msgPrivacy.includes("권한") ? "text-red-600" : "text-emerald-600"}`}
              >
                {msgPrivacy}
              </span>
            )}
            <button
              type="button"
              onClick={savePrivacy}
              disabled={savingPrivacy}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {savingPrivacy ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <textarea
            value={privacyPolicy}
            onChange={(e) => setPrivacyPolicy(e.target.value)}
            className="min-h-[360px] w-full resize-y rounded-md border border-gray-300 px-3 py-3 text-sm leading-relaxed text-gray-900 shadow-sm focus:border-[#4e73df] focus:outline-none focus:ring-1 focus:ring-[#4e73df]"
            spellCheck={false}
            aria-label="개인정보취급방침 본문"
          />
        </div>
      </section>
    </div>
  );
}
