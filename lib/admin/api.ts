import { Capacitor } from "@capacitor/core";
import { ApiError } from "../api-utils";

const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && !Capacitor.isNativePlatform()) {
    const { origin, protocol } = window.location;
    if (protocol === "http:" || protocol === "https:") {
      return origin;
    }
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) return apiUrl;
  if (Capacitor.isNativePlatform()) {
    const serverUrl = (Capacitor as { getServerUrl?: () => string })
      .getServerUrl?.();
    if (serverUrl) return serverUrl;
    const platform = Capacitor.getPlatform();
    if (platform === "android") return "http://10.0.2.2:3000";
    if (platform === "ios") return "http://localhost:3000";
  }
  return "";
};

const buildApiUrl = (path: string) => {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
};

export type Notice = {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string | null;
  views: number;
  created_at: string;
  updated_at: string;
};

export type CreateNoticePayload = {
  title: string;
  content: string;
  author: string;
  category?: string;
};

export type GetNoticesResult = {
  success: true;
  data: Notice[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
};

export const getNotices = async (
  page = 1,
  limit = 15,
): Promise<GetNoticesResult> => {
  const url = new URL(buildApiUrl("/www/admin/notices"));
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error && typeof data.error === "string"
        ? data.error
        : "공지사항 목록을 불러오는데 실패했습니다.";
    throw { message } satisfies ApiError;
  }

  return data;
};

export type UpdateNoticePayload = CreateNoticePayload;

export const getNotice = async (id: number): Promise<{ success: true; data: Notice }> => {
  const response = await fetch(buildApiUrl(`/www/admin/notices/${id}`), {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error && typeof data.error === "string"
        ? data.error
        : "공지를 불러오는데 실패했습니다.";
    throw { message } satisfies ApiError;
  }

  return data;
};

export const updateNotice = async (
  id: number,
  payload: UpdateNoticePayload,
) => {
  const response = await fetch(buildApiUrl(`/www/admin/notices/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error && typeof data.error === "string"
        ? data.error
        : "공지사항 수정에 실패했습니다.";
    const fieldErrors =
      data?.error && typeof data.error === "object"
        ? (data.error as Record<string, string[]>)
        : undefined;
    throw { message, fieldErrors } satisfies ApiError;
  }

  return data;
};

export const createNotice = async (payload: CreateNoticePayload) => {
  const response = await fetch(buildApiUrl("/www/admin/notices"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.error && typeof data.error === "string"
        ? data.error
        : "공지사항 등록에 실패했습니다.";
    const fieldErrors =
      data?.error && typeof data.error === "object"
        ? (data.error as Record<string, string[]>)
        : undefined;
    throw { message, fieldErrors } satisfies ApiError;
  }

  return data;
};
