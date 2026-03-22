/** DB에 순수 텍스트만 있을 때 TipTap용 HTML로 감싸기 */
export function normalizeNoticeHtml(raw: string): string {
  const t = raw.trim();
  if (!t) return "<p></p>";
  if (/<[a-z][\s\S]*>/i.test(t)) return raw;
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const parts = escaped.split(/\n/);
  return parts.map((line) => `<p>${line || "<br>"}</p>`).join("");
}

/** HTML이 비어 있는지(또는 빈 문단만 있는지) 검사 */
export function isHtmlContentEmpty(html: string): boolean {
  if (typeof document === "undefined") {
    return !html.replace(/<[^>]+>/g, "").trim();
  }
  const d = document.createElement("div");
  d.innerHTML = html;
  return (d.textContent ?? "").trim().length === 0;
}
